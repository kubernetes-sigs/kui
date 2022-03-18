---
title: Autoscaling Using Go
layout:
    1: left
    2: right
    default: wizard
wizard:
    steps:
        - match: Prerequisites
          name: Install Required Tools
        - name: Deploy the Service
        - name: Load the Service
        - match: Analysis
          name: Analysis - Algorithm
        - name: Other Experiments
          describe: Run experiments to better understand analysis
        - name: Cleanup
        - name: Further reading
codeblocks:
    # Validation for Step 1: Install Required Tools
    - match: ^git clone -b "{{ branch }}" https://github.com/knative/docs knative-docs
          cd knative-docs$
      validate: $? -e 0 && exit 0 \|\| exit 1
    # Validation for Step 2: Deploy the Service
    - match: ^kubectl apply -f docs/serving/autoscaling/autoscale-go/service.yaml$
      validate: kn service describe service
    - match: ^kubectl get ksvc autoscale-go$
      validate: $? -e 0 && exit 0 \|\| exit 1
    # Validation for Step 3: Load the Service
    - match: ^curl "http://autoscale-go.default.1.2.3.4.sslip.io?sleep=100&prime=10000&bloat=5"$
      validate: $body
    - match: ^hey -z 30s -c 50
      validate: $? -e 0 && exit 0 \|\| exit 1
    # Validation for Step 5: Other Experiments
    - match: ^hey -z 60s -c 100
      validate: $? -e 0 && exit 0 \|\| exit 1
    - match: ^hey -z 60s -q 100
      validate: $? -e 0 && exit 0 \|\| exit 1
    - match: ^hey -z 60s -q 100
      validate: $? -e 0 && exit 0 \|\| exit 1
    - match: ^hey -z 60s -q 100
      validate: $? -e 0 && exit 0 \|\| exit 1
    - match: ^hey -z 60s -c 5
      validate: $? -e 0 && exit 0 \|\| exit 1
    # Validation for Step 6: Cleanup
    - match: ^kubectl delete -f docs/serving/autoscaling/autoscale-go/service.yaml$
      validate: $? -e 0 && exit 0 \|\| exit 1
---

--8<-- "https://raw.githubusercontent.com/mra-ruiz/docs/guidebooks/docs/guidebooks/knative-serving-autoscaling-go.md"