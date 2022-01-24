---
title: Welcome to Iter8
layout:
  1: left
---

# Iter8: The Release Engineering Platform for Kubernetes

[Iter8](https://iter8.tools) is the **release engineering** platform
for Kubernetes applications and ML models.

Iter8 is designed for DevOps and MLOps teams interested in maximizing
release velocity and business value with their apps/ML models while
protecting end-user experience. Use Iter8 for SLO validation, A/B
testing and progressive rollouts of K8s apps/ML models.

### Contacts

- [Join us on Slack](https://join.slack.com/t/iter8-tools/shared_invite/zt-awl2se8i-L0pZCpuHntpPejxzLicbmw)
- [Attend our Community Meetings](https://iter8.tools/0.7/getting-started/help/)
- [Contributors welcome](https://iter8.tools/0.7/contributing/overview)

---

## What is an Iter8 experiment?

Iter8 defines a Kubernetes resource called Experiment that automates
SLO validation, A/B(/n) testing and progressive rollouts as shown
below.

![Iter8 Overview](https://iter8.tools/0.7/images/whatisiter8.png)

## How does Iter8 work?

Iter8 consists of a Go-based Kubernetes controller that orchestrates
(reconciles) experiments in conjunction with a Python-based analytics
service, and a Go-based task runner.

## About this guided tutorial

This guided walkthrough of iter8 has been structured to walk you
through different features of **iter8**. You can click on each of the
links below and they will open a separate tab. The tutorial has been
structured in a manner that it starts with the basics and then
progressing on to live guided tutorials walking through different use
cases.

1. [What is iter8?](https://iter8.tools)
2. Continuous Deployment using iter8
   1. [Upgrading your application from staging to production based off certain metrics](#kuiexec?command=replay%20%2Fkui%2Fiter81-v4.json&quiet)
   2. [Progressively rolling out your application, shifting traffic from one version to another](#kuiexec?command=replay%20%2Fkui%2Fiter82-v4.json&quiet)
3. Rolling out Machine Learning models with iter8
