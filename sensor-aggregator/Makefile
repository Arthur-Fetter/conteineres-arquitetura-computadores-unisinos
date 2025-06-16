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

deploy-k8s-local:
	minikube image load sensor-aggregator:1.0
	helm install sensor-aggregator ./deploy/helm
