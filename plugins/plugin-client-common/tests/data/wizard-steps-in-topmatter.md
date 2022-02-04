---
wizard:
    steps:
        - match: Install Knative using quickstart
          name: TestRewritingOfStepName
        - name: Before you begin
          description: TestDescription2
        - name: Prepare local Kubernetes cluster
        - Install the Knative CLI
        - name: Install the Knative quickstart plugin
          description: This gives you a kn quickstart command
        - name: Run the Knative quickstart plugin
          description: This will quickly set up Knative against kind or minikube
        - Next steps
---

# Getting Started with Knative

WizardDescriptionInTopmatter

---

--8<-- "https://raw.githubusercontent.com/knative/docs/main/docs/getting-started/quickstart-install.md"

