package com.ethree.iot.vo;

import java.sql.Timestamp;

public class RecentDataVO {
	
    private Long id;

    private String serialNumber;
    
    /*DTO*/
    private String deviceTp;
    private String indoor;
    private String regDtStr;
    
    private Integer e3Index;
    private Double e3Score;

    private Integer pm10;
    private Integer pm10Index;
    private Integer pm10Alarm;
    private Double pm10Score;
    private Integer pm10Org;

    private Integer pm25;
    private Integer pm25Index;
    private Integer pm25Alarm;
    private Double pm25Score;
    private Integer pm25Org;

    private Integer co2;
    private Integer co2Index;
    private Integer co2Alarm;
    private Double co2Score;
    private Integer co2Org;

    private Integer hcho;
    private Integer hchoIndex;
    private Integer hchoAlarm;
    private Double hchoScore;
    private Integer hchoOrg;

    private Integer voc;
    private Integer vocIndex;
    private Integer vocAlarm;
    private Double vocScore;
    private Integer vocOrg;

    private Double temperature;
    private Integer temperatureIndex;
    private Integer temperatureAlarm;
    private Double temperatureScore;
    private Double temperatureOrg;

    private Double humidity;
    private Integer humidityIndex;
    private Integer humidityAlarm;
    private Double humidityScore;
    private Double humidityOrg;

    private Integer noise;
    private Integer noiseIndex;
    private Integer noiseAlarm;
    private Double noiseScore;
    private Integer noiseOrg;

    private Integer co;
    private Integer coIndex;
    private Integer coAlarm;
    private Double coScore;
    private Integer coOrg;

    private Timestamp regDt;
    private Timestamp modDt;
    private Timestamp paramDt;
    
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getSerialNumber() {
		return serialNumber;
	}
	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}
	public Integer getE3Index() {
		return e3Index;
	}
	public void setE3Index(Integer e3Index) {
		this.e3Index = e3Index;
	}
	
	public Double getE3Score() {
		return e3Score;
	}
	public void setE3Score(Double e3Score) {
		this.e3Score = e3Score;
	}
	public Integer getPm10() {
		return pm10;
	}
	public void setPm10(Integer pm10) {
		this.pm10 = pm10;
	}
	public Integer getPm10Index() {
		return pm10Index;
	}
	public void setPm10Index(Integer pm10Index) {
		this.pm10Index = pm10Index;
	}
	public Integer getPm10Alarm() {
		return pm10Alarm;
	}
	public void setPm10Alarm(Integer pm10Alarm) {
		this.pm10Alarm = pm10Alarm;
	}
	public Integer getPm10Org() {
		return pm10Org;
	}
	public void setPm10Org(Integer pm10Org) {
		this.pm10Org = pm10Org;
	}
	public Integer getPm25() {
		return pm25;
	}
	public void setPm25(Integer pm25) {
		this.pm25 = pm25;
	}
	public Integer getPm25Index() {
		return pm25Index;
	}
	public void setPm25Index(Integer pm25Index) {
		this.pm25Index = pm25Index;
	}
	public Integer getPm25Alarm() {
		return pm25Alarm;
	}
	public void setPm25Alarm(Integer pm25Alarm) {
		this.pm25Alarm = pm25Alarm;
	}
	public Integer getPm25Org() {
		return pm25Org;
	}
	public void setPm25Org(Integer pm25Org) {
		this.pm25Org = pm25Org;
	}
	public Integer getCo2() {
		return co2;
	}
	public void setCo2(Integer co2) {
		this.co2 = co2;
	}
	public Integer getCo2Index() {
		return co2Index;
	}
	public void setCo2Index(Integer co2Index) {
		this.co2Index = co2Index;
	}
	public Integer getCo2Alarm() {
		return co2Alarm;
	}
	public void setCo2Alarm(Integer co2Alarm) {
		this.co2Alarm = co2Alarm;
	}
	public Integer getCo2Org() {
		return co2Org;
	}
	public void setCo2Org(Integer co2Org) {
		this.co2Org = co2Org;
	}
	public Integer getHcho() {
		return hcho;
	}
	public void setHcho(Integer hcho) {
		this.hcho = hcho;
	}
	public Integer getHchoIndex() {
		return hchoIndex;
	}
	public void setHchoIndex(Integer hchoIndex) {
		this.hchoIndex = hchoIndex;
	}
	public Integer getHchoAlarm() {
		return hchoAlarm;
	}
	public void setHchoAlarm(Integer hchoAlarm) {
		this.hchoAlarm = hchoAlarm;
	}
	public Integer getHchoOrg() {
		return hchoOrg;
	}
	public void setHchoOrg(Integer hchoOrg) {
		this.hchoOrg = hchoOrg;
	}
	public Integer getVoc() {
		return voc;
	}
	public void setVoc(Integer voc) {
		this.voc = voc;
	}
	public Integer getVocIndex() {
		return vocIndex;
	}
	public void setVocIndex(Integer vocIndex) {
		this.vocIndex = vocIndex;
	}
	public Integer getVocAlarm() {
		return vocAlarm;
	}
	public void setVocAlarm(Integer vocAlarm) {
		this.vocAlarm = vocAlarm;
	}
	public Integer getVocOrg() {
		return vocOrg;
	}
	public void setVocOrg(Integer vocOrg) {
		this.vocOrg = vocOrg;
	}
	public Double getTemperature() {
		return temperature;
	}
	public void setTemperature(Double temperature) {
		this.temperature = temperature;
	}
	public Integer getTemperatureIndex() {
		return temperatureIndex;
	}
	public void setTemperatureIndex(Integer temperatureIndex) {
		this.temperatureIndex = temperatureIndex;
	}
	public Integer getTemperatureAlarm() {
		return temperatureAlarm;
	}
	public void setTemperatureAlarm(Integer temperatureAlarm) {
		this.temperatureAlarm = temperatureAlarm;
	}
	public Double getTemperatureOrg() {
		return temperatureOrg;
	}
	public void setTemperatureOrg(Double temperatureOrg) {
		this.temperatureOrg = temperatureOrg;
	}
	public Double getHumidity() {
		return humidity;
	}
	public void setHumidity(Double humidity) {
		this.humidity = humidity;
	}
	public Integer getHumidityIndex() {
		return humidityIndex;
	}
	public void setHumidityIndex(Integer humidityIndex) {
		this.humidityIndex = humidityIndex;
	}
	public Integer getHumidityAlarm() {
		return humidityAlarm;
	}
	public void setHumidityAlarm(Integer humidityAlarm) {
		this.humidityAlarm = humidityAlarm;
	}
	public Double getHumidityOrg() {
		return humidityOrg;
	}
	public void setHumidityOrg(Double humidityOrg) {
		this.humidityOrg = humidityOrg;
	}
	public Integer getNoise() {
		return noise;
	}
	public void setNoise(Integer noise) {
		this.noise = noise;
	}
	public Integer getNoiseIndex() {
		return noiseIndex;
	}
	public void setNoiseIndex(Integer noiseIndex) {
		this.noiseIndex = noiseIndex;
	}
	public Integer getNoiseAlarm() {
		return noiseAlarm;
	}
	public void setNoiseAlarm(Integer noiseAlarm) {
		this.noiseAlarm = noiseAlarm;
	}
	public Integer getNoiseOrg() {
		return noiseOrg;
	}
	public void setNoiseOrg(Integer noiseOrg) {
		this.noiseOrg = noiseOrg;
	}
	public Integer getCo() {
		return co;
	}
	public void setCo(Integer co) {
		this.co = co;
	}
	public Integer getCoIndex() {
		return coIndex;
	}
	public void setCoIndex(Integer coIndex) {
		this.coIndex = coIndex;
	}
	public Integer getCoAlarm() {
		return coAlarm;
	}
	public void setCoAlarm(Integer coAlarm) {
		this.coAlarm = coAlarm;
	}
	public Integer getCoOrg() {
		return coOrg;
	}
	public void setCoOrg(Integer coOrg) {
		this.coOrg = coOrg;
	}
	public Timestamp getRegDt() {
		return regDt;
	}
	public void setRegDt(Timestamp regDt) {
		this.regDt = regDt;
	}
	public Timestamp getModDt() {
		return modDt;
	}
	public void setModDt(Timestamp modDt) {
		this.modDt = modDt;
	}
	public String getDeviceTp() {
		return deviceTp;
	}
	public void setDeviceTp(String deviceTp) {
		this.deviceTp = deviceTp;
	}
	public String getIndoor() {
		return indoor;
	}
	public void setIndoor(String indoor) {
		this.indoor = indoor;
	}
	public String getRegDtStr() {
		return regDtStr;
	}
	public void setRegDtStr(String regDtStr) {
		this.regDtStr = regDtStr;
	}
	
	
	public Double getPm10Score() {
		return pm10Score;
	}
	public void setPm10Score(Double pm10Score) {
		this.pm10Score = pm10Score;
	}
	public Double getPm25Score() {
		return pm25Score;
	}
	public void setPm25Score(Double pm25Score) {
		this.pm25Score = pm25Score;
	}
	public Double getCo2Score() {
		return co2Score;
	}
	public void setCo2Score(Double co2Score) {
		this.co2Score = co2Score;
	}
	public Double getHchoScore() {
		return hchoScore;
	}
	public void setHchoScore(Double hchoScore) {
		this.hchoScore = hchoScore;
	}
	public Double getVocScore() {
		return vocScore;
	}
	public void setVocScore(Double vocScore) {
		this.vocScore = vocScore;
	}
	public Double getTemperatureScore() {
		return temperatureScore;
	}
	public void setTemperatureScore(Double temperatureScore) {
		this.temperatureScore = temperatureScore;
	}
	public Double getHumidityScore() {
		return humidityScore;
	}
	public void setHumidityScore(Double humidityScore) {
		this.humidityScore = humidityScore;
	}
	public Double getNoiseScore() {
		return noiseScore;
	}
	public void setNoiseScore(Double noiseScore) {
		this.noiseScore = noiseScore;
	}
	public Double getCoScore() {
		return coScore;
	}
	public void setCoScore(Double coScore) {
		this.coScore = coScore;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Timestamp getParamDt() {
		return paramDt;
	}
	public void setParamDt(Timestamp paramDt) {
		this.paramDt = paramDt;
	}
	
	@Override
	public String toString() {
		return "RecentDataVO [id=" + id + ", serialNumber=" + serialNumber + ", deviceTp=" + deviceTp + ", indoor="
				+ indoor + ", regDtStr=" + regDtStr + ", e3Index=" + e3Index + ", e3Score=" + e3Score + ", pm10=" + pm10
				+ ", pm10Index=" + pm10Index + ", pm10Alarm=" + pm10Alarm + ", pm10Score=" + pm10Score + ", pm10Org="
				+ pm10Org + ", pm25=" + pm25 + ", pm25Index=" + pm25Index + ", pm25Alarm=" + pm25Alarm + ", pm25Score="
				+ pm25Score + ", pm25Org=" + pm25Org + ", co2=" + co2 + ", co2Index=" + co2Index + ", co2Alarm="
				+ co2Alarm + ", co2Score=" + co2Score + ", co2Org=" + co2Org + ", hcho=" + hcho + ", hchoIndex="
				+ hchoIndex + ", hchoAlarm=" + hchoAlarm + ", hchoScore=" + hchoScore + ", hchoOrg=" + hchoOrg
				+ ", voc=" + voc + ", vocIndex=" + vocIndex + ", vocAlarm=" + vocAlarm + ", vocScore=" + vocScore
				+ ", vocOrg=" + vocOrg + ", temperature=" + temperature + ", temperatureIndex=" + temperatureIndex
				+ ", temperatureAlarm=" + temperatureAlarm + ", temperatureScore=" + temperatureScore
				+ ", temperatureOrg=" + temperatureOrg + ", humidity=" + humidity + ", humidityIndex=" + humidityIndex
				+ ", humidityAlarm=" + humidityAlarm + ", humidityScore=" + humidityScore + ", humidityOrg="
				+ humidityOrg + ", noise=" + noise + ", noiseIndex=" + noiseIndex + ", noiseAlarm=" + noiseAlarm
				+ ", noiseScore=" + noiseScore + ", noiseOrg=" + noiseOrg + ", co=" + co + ", coIndex=" + coIndex
				+ ", coAlarm=" + coAlarm + ", coScore=" + coScore + ", coOrg=" + coOrg + ", regDt=" + regDt + ", modDt="
				+ modDt + "]";
	}

}
