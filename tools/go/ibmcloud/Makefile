BINARY=kui-ibmcloud-plugin

PLATFORMS=darwin linux windows
ARCHITECTURES=amd64

VERSION=$(shell node -e 'console.log(require("@kui-shell/client/package.json").version)')
LDFLAGS=-ldflags "-X github.com/IBM/kui/launcher.PLUGIN_VERSION=$(VERSION)"

all: clean build

# build for current platform
build: main.go launcher/launcher.go
	go build ${LDFLAGS} -o ${BINARY}

# build for all platforms and architectures
build_all:
	$(foreach GOOS, $(PLATFORMS),\
	$(foreach GOARCH, $(ARCHITECTURES), $(shell export GOOS=$(GOOS); export GOARCH=$(GOARCH); go build ${LDFLAGS} -o $(BINARY)-$(GOOS)-$(GOARCH))))

# install as ibmcloud plugin
install: build
	ibmcloud plugin install ${BINARY}

test: all
	go test ./... ${LDFLAGS}

clean:
	rm -f ${BINARY}
	$(foreach GOOS, $(PLATFORMS),\
	$(foreach GOARCH, $(ARCHITECTURES), rm -f $(BINARY)-$(GOOS)-$(GOARCH)))
