package io.irontest.db;

import io.irontest.models.Endpoint;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by Trevor Li on 6/30/15.
 */
public class EndpointMapper implements ResultSetMapper<Endpoint> {
    public Endpoint map(int index, ResultSet rs, StatementContext ctx) throws SQLException {
        return new Endpoint(rs.getLong("id"), rs.getLong("environmentId"), rs.getString("name"), rs.getString("type"),
                rs.getString("description"), rs.getString("url"), rs.getString("username"), rs.getString("password"),
                rs.getTimestamp("created"), rs.getTimestamp("updated"));
    }
}
