---
title: Installing Knative
---

# Installing Knative

You can install the Serving component, Eventing component, or both on your
cluster by using one of the following deployment options:

- Use the [Knative Quickstart plugin](install-knative-quickstart.md) to install a
preconfigured, local distribution of Knative for development purposes.

- Use a YAML-based installation to install a production ready deployment:
    - [Install Knative Serving by using YAML](installing-serving-with-yaml.md)
    - [Install Knative Eventing by using YAML](https://raw.githubusercontent.com/mra-ruiz/docs/guidebooks/docs/install/yaml-install/eventing/install-eventing-with-yaml.md)

- Use the [Knative Operator](https://raw.githubusercontent.com/mra-ruiz/docs/guidebooks/docs/install/operator/knative-with-operators.md) to install and
configure a production ready deployment.

- Follow the documentation for vendor managed [Knative offerings](https://raw.githubusercontent.com/mra-ruiz/docs/guidebooks/docs/install/knative-offerings.md).

You can also [upgrade an existing Knative installation](https://raw.githubusercontent.com/mra-ruiz/docs/guidebooks/docs/install/upgrade/README.md).

!!! note
    Knative installation instructions assume you are running Mac or Linux with a bash shell.