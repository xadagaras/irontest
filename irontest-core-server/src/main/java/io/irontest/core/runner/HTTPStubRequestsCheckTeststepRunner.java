package io.irontest.core.runner;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.stubbing.ServeEvent;
import io.irontest.models.teststep.Teststep;
import io.irontest.utils.IronTestUtils;

import java.util.List;

public class HTTPStubRequestsCheckTeststepRunner extends TeststepRunner {
    @Override
    protected BasicTeststepRun run(Teststep teststep) {
        BasicTeststepRun basicTeststepRun = new BasicTeststepRun();

        WireMockServer wireMockServer = getTestcaseRunContext().getWireMockServer();
        WireMockServerAPIResponse response = new WireMockServerAPIResponse();

        List<ServeEvent> allServeEvents = wireMockServer.getAllServeEvents();
        for (ServeEvent serveEvent: allServeEvents) {
            response.getAllServeEvents().add(IronTestUtils.updateUnmatchedStubRequest(serveEvent, wireMockServer));
        }

        basicTeststepRun.setResponse(response);

        return basicTeststepRun;
    }
}
