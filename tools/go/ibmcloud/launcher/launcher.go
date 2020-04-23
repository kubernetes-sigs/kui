package launcher

import (
	"fmt"
	"github.com/IBM-Cloud/ibm-cloud-cli-sdk/bluemix/terminal"
	"github.com/IBM-Cloud/ibm-cloud-cli-sdk/bluemix/trace"
	"github.com/IBM-Cloud/ibm-cloud-cli-sdk/common/downloader"
	"github.com/IBM-Cloud/ibm-cloud-cli-sdk/common/file_helpers"
	"github.com/IBM-Cloud/ibm-cloud-cli-sdk/plugin"
	"github.com/mholt/archiver"
	. "github.com/IBM/kui/i18n"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
)

type CloudShellPlugin struct {
	ui terminal.UI
}

// this value will be injected at build time, e.g. via
// go build -ldflags "-X github.com/IBM/kui/launcher.PLUGIN_VERSION=$(node -e 'console.log(require("@kui-shell/client/package.json").version)')"
// which pulls the version from @kui-shell/client/package.json
var PLUGIN_VERSION string

func Start() {
	argsWithoutProg := os.Args[1:]
	if len(argsWithoutProg) > 0 && argsWithoutProg[0] == "version" {
		version := GetVersion()
		fmt.Println(version.String())
		return
	}

	trace.Logger.Println("new cloudshellplugin")
	plugin.Start(new(CloudShellPlugin))
}

func (p *CloudShellPlugin) init(ui terminal.UI) {
	p.ui = ui
}

func (shellPlugin *CloudShellPlugin) Run(context plugin.PluginContext, args []string) {
	trace.Logger = trace.NewLogger(context.Trace())
	shellPlugin.init(terminal.NewStdUI())
	shellArgs := args[1:]

	cmd, err := shellPlugin.DownloadDistIfNecessary(context)
	if err != nil {
		os.Exit(1)
		return
	}
	shellPlugin.invokeRun(context, cmd, shellArgs)
}

func (shellPlugin *CloudShellPlugin) invokeRun(context plugin.PluginContext, cmd *exec.Cmd, shellArgs []string) {
	cmd.Args = append(cmd.Args, shellArgs...)
	if err := cmd.Start(); err != nil {
		fmt.Println("command failed!")
	}
}

func GetDistOSSuffix() string {
	switch runtime.GOOS {
	case "windows":
		return "-win32-x64.zip"
	case "darwin":
		return "-darwin-x64.tar.bz2"
	default:
		return "-linux-x64.zip"
	}
}

func GetRootCommand(extractedDir string) *exec.Cmd {
	switch runtime.GOOS {
	case "windows":
		// TODO verify
		return exec.Command(filepath.Join(extractedDir, "Kui-win32-x64\\Kui.exe"))
	case "darwin":
		return exec.Command(filepath.Join(extractedDir, "Kui-darwin-x64/Kui.app/Contents/MacOS/Kui"))
	default:
		// TODO verify
		return exec.Command(filepath.Join(extractedDir, "Kui-linux-x64/Kui"))
	}
}

func GetDistLocation(version string) string {
	host := "https://github.com/IBM/kui/releases/download/"
	DEV_OVERRIDE_HOST, overrideSet := os.LookupEnv("KUI_DIST")
	if overrideSet {
		host = DEV_OVERRIDE_HOST
	}
	if !strings.HasSuffix(host, "/") {
		host += "/"
	}
	return host + "v" + version + "/Kui" + GetDistOSSuffix()
}

func (p *CloudShellPlugin) DownloadDistIfNecessary(context plugin.PluginContext) (*exec.Cmd, error) {
	DIST_PATH, overrideSet := os.LookupEnv("KUI_DIST_PATH")
	if overrideSet {
		trace.Logger.Println("using KUI_DIST_PATH " + DIST_PATH)

		command := exec.Command(DIST_PATH)
		command.Env = append(os.Environ(), "KUI_POPUP_WINDOW_RESIZE=true")
		return command, nil
	}

	trace.Logger.Println("KUI_DIST_PATH not set, try downloading")

	metadata := p.GetMetadata()
	version := metadata.Version.String()

	url := GetDistLocation(version)

	targetDir := filepath.Join(context.PluginDirectory(), "/cache-"+version)

	successFile := filepath.Join(targetDir, "success")
	extractedDir := filepath.Join(targetDir, "extract")
	command := GetRootCommand(extractedDir)
	command.Env = append(os.Environ(), "KUI_POPUP_WINDOW_RESIZE=true")

	if !file_helpers.FileExists(successFile) {
		downloadedFile := filepath.Join(targetDir, "downloaded.zip")
		extractedDir := filepath.Join(targetDir, "extract")

		os.MkdirAll(extractedDir, 0700)

		fileDownloader := new(downloader.FileDownloader)
		fileDownloader.ProxyReader = downloader.NewProgressBar(p.ui.Writer())
		trace.Logger.Println("Downloading shell from " + url + " to " + downloadedFile)
		if _, _, err := fileDownloader.DownloadTo(url, downloadedFile); err != nil {
			handleError(err, p.ui)
			return nil, err
		}
		trace.Logger.Println("Downloaded shell to " + downloadedFile)

		trace.Logger.Println("Extracting shell to " + extractedDir)
		if strings.HasSuffix(url, ".tar.bz2") {
			if err := archiver.DefaultTarBz2.Unarchive(downloadedFile, extractedDir); err != nil {
				handleError(err, p.ui)
				return nil, err
			}
		} else {
			if err := archiver.DefaultZip.Unarchive(downloadedFile, extractedDir); err != nil {
				handleError(err, p.ui)
				return nil, err
			}
		}

		trace.Logger.Println("Extracted shell to " + extractedDir)

		if _, err := os.OpenFile(successFile, os.O_RDONLY|os.O_CREATE, 0666); err != nil {
			handleError(err, p.ui)
			return nil, err
		}
	} else {
		trace.Logger.Println("Using cached download")
	}

	return command, nil
}

func MakeExecutable(path string) error {
	return filepath.Walk(path, func(name string, info os.FileInfo, err error) error {
		if err == nil {
			err = os.Chmod(name, 0700)
		}
		return err
	})
}

func (shellPlugin *CloudShellPlugin) GetMetadata() plugin.PluginMetadata {
	return plugin.PluginMetadata{
		Name:    "kui",
		Version: GetVersion(),
		Commands: []plugin.Command{
			{
				Name:        "kui",
				// Alias:       "kui",
				Description: "Kui Visual Terminal",
				Usage:       "ibmcloud kui",
			},
		},
	}
}

func handleError(err error, ui terminal.UI) {
	switch err {
	case nil:
		return
	default:
		ui.Failed(T("An error has occurred:\n{{.Error}}\n", map[string]interface{}{"Error": err.Error()}))
	}

	return
}

func toInt(in string) int {
	outValue, _ := strconv.Atoi(in)
	return outValue
}

func GetVersion() plugin.VersionType {
	s := strings.Split(PLUGIN_VERSION, ".")
	return plugin.VersionType{
		Major: toInt(s[0]),
		Minor: toInt(s[1]),
		Build: toInt(s[2]),
	}
}
