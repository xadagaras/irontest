package io.irontest.models.testrun;

import com.fasterxml.jackson.annotation.JsonView;
import io.irontest.resources.ResourceJsonViews;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Zheng on 9/03/2018.
 */
public class DataDrivenTestcaseRun extends TestcaseRun {
    @JsonView(ResourceJsonViews.TestcaseRunResultOnTestcaseEditView.class)
    private List<TestcaseIndividualRun> individualRuns = new ArrayList<>();

    public List<TestcaseIndividualRun> getIndividualRuns() {
        return individualRuns;
    }

    public void setIndividualRuns(List<TestcaseIndividualRun> individualRuns) {
        this.individualRuns = individualRuns;
    }
}