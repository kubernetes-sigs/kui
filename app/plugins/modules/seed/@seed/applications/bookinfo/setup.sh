helm repo add ibm-charts https://registry.bluemix.net/helm/ibm-charts
kubectl apply -f https://raw.githubusercontent.com/IBM/charts/master/stable/ibm-istio/templates/crds.yaml
helm install ibm-charts/ibm-istio --name=istio --namespace istio-system
kubectl label namespace default istio-injection=enabled
kubectl apply -f ${cwd}/seeds
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.0/samples/bookinfo/platform/kube/bookinfo.yaml
