package io.irontest.models.assertion;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.irontest.models.Properties;

import java.util.Date;

/**
 * Created by Zheng on 19/07/2015.
 */
public class Assertion {
    public static final String ASSERTION_TYPE_CONTAINS = "Contains";
    public static final String ASSERTION_TYPE_XPATH = "XPath";
    public static final String ASSERTION_TYPE_DSFIELD = "DSField";
    public static final String ASSERTION_TYPE_INTEGER_EQUALS = "IntegerEquals";
    private long id;
    private long teststepId;
    private String name;
    private String type;
    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXTERNAL_PROPERTY, property = "type")
    @JsonSubTypes({
            @JsonSubTypes.Type(value = ContainsAssertionProperties.class, name = Assertion.ASSERTION_TYPE_CONTAINS),
            @JsonSubTypes.Type(value = XPathAssertionProperties.class, name = Assertion.ASSERTION_TYPE_XPATH),
            @JsonSubTypes.Type(value = DSFieldAssertionProperties.class, name = Assertion.ASSERTION_TYPE_DSFIELD),
            @JsonSubTypes.Type(value = IntegerEqualsAssertionProperties.class,
                    name = Assertion.ASSERTION_TYPE_INTEGER_EQUALS)})
    private Properties otherProperties;
    private Date created;
    private Date updated;

    public Assertion() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getTeststepId() {
        return teststepId;
    }

    public void setTeststepId(long teststepId) {
        this.teststepId = teststepId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }

    public Properties getOtherProperties() {
        return otherProperties;
    }

    public void setOtherProperties(Properties otherProperties) {
        this.otherProperties = otherProperties;
    }
}
