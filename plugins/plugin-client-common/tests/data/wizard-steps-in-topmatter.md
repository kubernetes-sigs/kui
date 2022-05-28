---
wizard:
    steps:
        - name: Prepare local Kubernetes cluster
        - match: Install the Knative CLI
          name: TestRewritingOfStepName
        - name: Install the Knative quickstart plugin
          description: TestDescription2
        - name: Run the Knative quickstart plugin
          description: This will quickly set up Knative against kind or minikube
        - Next steps
---

# Getting Started with Knative

WizardDescriptionInTopmatter

---

--8<-- "https://raw.githubusercontent.com/knative/docs/main/docs/getting-started/quickstart-install.md"

