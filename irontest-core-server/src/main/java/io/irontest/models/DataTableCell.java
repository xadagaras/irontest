package io.irontest.models;

/**
 * Created by Zheng on 16/03/2018.
 */
public class DataTableCell {
    private short rowSequence;
    private String value = "";
    private Long endpointId;

    public short getRowSequence() {
        return rowSequence;
    }

    public void setRowSequence(short rowSequence) {
        this.rowSequence = rowSequence;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Long getEndpointId() {
        return endpointId;
    }

    public void setEndpointId(Long endpointId) {
        this.endpointId = endpointId;
    }
}
