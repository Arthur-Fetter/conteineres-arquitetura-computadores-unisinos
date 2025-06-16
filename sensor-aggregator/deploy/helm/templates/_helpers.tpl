{{- define "sensor-aggregator.name" -}}
sensor-aggregator
{{- end }}

{{- define "sensor-aggregator.fullname" -}}
{{ .Release.Name }}
{{- end }}
