run-dev:
	npm run dev

build-docker-image:
	docker build -t sensor-aggregator:1.0 .

init-minikube:
	minikube start --memory=8192 --cpus=4 --disk-size=40g

spinup-yugabyte-local:
	# Remember to have a namespace initialized
	kubectl create namespace yb-demo
	helm install yb-demo yugabytedb/yugabyte \
	--version 2.25.2 \
	--set resource.master.requests.cpu=0.5,resource.master.requests.memory=0.5Gi,\
	resource.tserver.requests.cpu=0.5,resource.tserver.requests.memory=0.5Gi,\
	replicas.master=1,replicas.tserver=1 --namespace yb-demo

spindown-yugabyte-local:
	helm delete yb-demo -n yb-demo
	kubectl delete pvc --namespace yb-demo -l app=yb-master
	kubectl delete pvc --namespace yb-demo -l app=yb-tserver
	kubectl delete namespace yb-demo

deploy-sensor-aggregator-local:
	minikube image load sensor-aggregator:1.0
	helm install sensor-aggregator ./deploy/helm

spindown-sensor-aggregator-local:
	helm uninstall sensor-aggregator

deploy-kube-prometheus-stack:
	kubectl create namespace monitoring
	helm install prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring

uninstall-kube-prometheus-stack:
	helm uninstall prometheus-stack -n monitoring
	kubectl delete namespace monitoring

# ab testing not yet working
# ab-local:
# 	kubectl run ab --image=jordi/ab -it --rm --restart=Never -- sh
# 	ab -n 100 -c 10 http://sensor-aggregator:8082/

deploy-k8s-locally: build-docker-image init-minikube spinup-yugabyte-local deploy-sensor-aggregator-local deploy-kube-prometheus-stack

spindown-k8s-locally: uninstall-kube-prometheus-stack spindown-sensor-aggregator-local spindown-yugabyte-local 
	minikube delete
