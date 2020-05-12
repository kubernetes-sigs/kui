package i18n

import (
	"path/filepath"
	"strings"
	goi18n "github.com/nicksnyder/go-i18n/i18n"
	"github.com/IBM-Cloud/ibm-cloud-cli-sdk/bluemix/configuration/core_config"
	"github.com/IBM/kui/i18n/detection"
	"github.com/IBM/kui/resources"
	"github.com/IBM-Bluemix/bluemix-cli-sdk/bluemix/trace"
)

const (
	DEFAULT_LOCALE = "en_US"
)

var SUPPORTED_LOCALES = []string{
	"de_DE",
	"en_US",
	"es_ES",
	"fr_FR",
	"it_IT",
	"ja_JA",
	"ko_KR",
	"pt_BR",
	"zh_Hans",
	"zh_Hant",
}

var resourcePath = filepath.Join("i18n", "resources")

func GetResourcePath() string {
	return resourcePath
}

func SetResourcePath(path string) {
	resourcePath = path
}

var T goi18n.TranslateFunc = Init(core_config.NewCoreConfig(func(error) {}), new(detection.JibberJabberDetector))

func Init(coreConfig core_config.Repository, detector detection.Detector) goi18n.TranslateFunc {
	trace.Logger = trace.NewLogger("true")
	userLocale := coreConfig.Locale()
	if userLocale != "" {
		return InitWithLocale(userLocale)
	}
	locale := supportedLocale(detector.DetectLocale())
	if locale == "" {
		locale = defaultLocaleForLang(detector.DetectLanguage())
	}
	if locale == "" {
		locale = DEFAULT_LOCALE
	}

	return InitWithLocale(locale)
}

func InitWithLocale(locale string) goi18n.TranslateFunc {
	err := loadFromAsset(locale)
	if err != nil {
		panic(err)
	}
	return goi18n.MustTfunc(locale)
}

func loadFromAsset(locale string) (err error) {
	assetName := locale + ".all.json"
	assetKey := filepath.Join(resourcePath, assetName)
	bytes, err := resources.Asset(assetKey)
	if err != nil {
		return
	}
	err = goi18n.ParseTranslationFileBytes(assetName, bytes)
	return
}

func supportedLocale(locale string) string {
	locale = normailizeLocale(locale)
	for _, l := range SUPPORTED_LOCALES {
		if strings.EqualFold(locale, l) {
			return l
		}
	}
	switch locale {
	case "zh_cn", "zh_sg":
		return "zh_Hans"
	case "zh_hk", "zh_tw":
		return "zh_Hant"
	}
	return ""
}

func normailizeLocale(locale string) string {
	return strings.ToLower(strings.Replace(locale, "-", "_", 1))
}

func defaultLocaleForLang(lang string) string {
	if lang != "" {
		lang = strings.ToLower(lang)
		for _, l := range SUPPORTED_LOCALES {
			if lang == l[0:2] {
				return l
			}
		}
	}
	return ""
}

func LangOfLocale(locale string) string {
	if len(locale) < 2 {
		return ""
	}
	return locale[0:2]
}
