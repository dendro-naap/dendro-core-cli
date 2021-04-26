package main

import "github.com/aws/aws-sdk-go/service/timestreamwrite"

func buildNginxAccessLogRecord(pRecord *RawRecord) {
	record := *pRecord

	var dimensions []*timestreamwrite.Dimension
	var timestamp string
	statusCode := "null" // TODO

	dimensions = insertDimension(pRecord, dimensions, "host")

	if keyExists(record, "parsed") {
		parsed := record["parsed"].(map[string]interface{})

		dimensions = insertDimension(&parsed, dimensions, "agent")
		dimensions = insertDimension(&parsed, dimensions, "client")
		dimensions = insertDimension(&parsed, dimensions, "method")
		dimensions = insertDimension(&parsed, dimensions, "path")
		dimensions = insertDimension(&parsed, dimensions, "referer")
		dimensions = insertDimension(&parsed, dimensions, "request")
		dimensions = insertDimension(&parsed, dimensions, "size")

		if keyExists(parsed, "status") {
			statusCode = parsed["status"].(string)
		}
	}

	if keyExists(record, "timestamp") {
		timestamp = record["timestamp"].(string)
	}

	unixTime := toUnix(timestamp)
	timeUnit := timestreamwrite.TimeUnitSeconds

	measureName := "statusCode"
	measureValueType := "VARCHAR"
	measureValue := statusCode

	nginxAccessLogRecords = append(nginxAccessLogRecords, &timestreamwrite.Record{
		Dimensions:       dimensions,
		MeasureName:      &measureName,
		MeasureValueType: &measureValueType,
		MeasureValue:     &measureValue,
		Time:             &unixTime,
		TimeUnit:         &timeUnit,
	})
}

func buildNginxErrorLogRecord(pRecord *RawRecord) {
	record := *pRecord

	var dimensions []*timestreamwrite.Dimension
	var timestamp string
	severity := "null" // TODO

	dimensions = insertDimension(pRecord, dimensions, "host")
	dimensions = insertDimension(pRecord, dimensions, "client")
	dimensions = insertDimension(pRecord, dimensions, "server")
	dimensions = insertDimension(pRecord, dimensions, "message")
	dimensions = insertDimension(pRecord, dimensions, "request")

	if keyExists(record, "timestamp") {
		timestamp = record["timestamp"].(string)
	}

	if keyExists(record, "severity") {
		severity = record["severity"].(string)
	}

	unixTime := toUnix(timestamp)
	timeUnit := timestreamwrite.TimeUnitSeconds

	measureName := "severity"
	measureValueType := "VARCHAR"
	measureValue := severity

	nginxErrorLogRecords = append(nginxErrorLogRecords, &timestreamwrite.Record{
		Dimensions:       dimensions,
		MeasureName:      &measureName,
		MeasureValueType: &measureValueType,
		MeasureValue:     &measureValue,
		Time:             &unixTime,
		TimeUnit:         &timeUnit,
	})
}

func buildNginxMetricRecord(pRecord *RawRecord) {
	record := *pRecord

	var dimensions []*timestreamwrite.Dimension
	var name string
	var timestamp string

	dimensions = insertDimension(pRecord, dimensions, "host")

	if keyExists(record, "timestamp") {
		timestamp = record["timestamp"].(string)
	}

	if keyExists(record, "name") {
		name = record["name"].(string)
	}

	unixTime := toUnix(timestamp)
	timeUnit := timestreamwrite.TimeUnitSeconds

	measureName := name
	measureValue := fetchMeasureValue(pRecord)
	measureValueType := "DOUBLE"

	nginxMetricRecords = append(nginxMetricRecords, &timestreamwrite.Record{
		Dimensions:       dimensions,
		MeasureName:      &measureName,
		MeasureValueType: &measureValueType,
		MeasureValue:     &measureValue,
		Time:             &unixTime,
		TimeUnit:         &timeUnit,
	})
}
