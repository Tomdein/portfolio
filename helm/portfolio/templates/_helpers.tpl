{{/*
Common labels
*/}}
{{- define "portfolio.labels" -}}
app: {{ .Chart.Name }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "portfolio.selectorLabels" -}}
app: {{ .Chart.Name }}
{{- end }}
