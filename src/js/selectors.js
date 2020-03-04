import { rollup, max } from "d3-array";
import { createSelector } from "reselect";
import getIthPoint from "./utils/get-ith-point";
import Constants from "./constants";
const { YEAR, UID, AGE_RANGE, CATEGORIES } = Constants;

export const dataQuestionsSelector = state => state.dataQuestions;
export const dataLinksSelector = state => state.dataLinks;
export const filtersSelector = state => state.filters;
export const currentStorySelector = state =>
  state.storyMenu.find(d => d.key === state.currentStoryKey);
export const appHeightSelector = state => state.appHeight;
export const svgWidthSelector = (state, props) => props.svgWidth;
export const yScaleSelector = (state, props) => props.yScale;

export const interimDataQuestionsSelector = createSelector(
  dataQuestionsSelector,
  filtersSelector,
  (questions, filters) => {
    const interimDataQuestions = questions
      .slice()
      .filter(d =>
        filters.reduce(
          (acc, f) =>
            acc && (d[f.key] === "" || f.selectedValues.indexOf(d[f.key]) > -1),
          true
        )
      );
    // only works if dataQuestions is sorted by Year
    let indexByYear = 0;
    let year = questions[0][YEAR];
    interimDataQuestions.forEach(e => {
      if (e[YEAR] === year) {
        e.indexByYear = indexByYear;
      } else {
        e.indexByYear = indexByYear = 0;
        year = e[YEAR];
      }
      indexByYear++;
    });
    return interimDataQuestions;
  }
);

export const qsByYearLookupSelector = createSelector(
  interimDataQuestionsSelector,
  questions =>
    rollup(
      questions,
      values => values.length,
      d => d[YEAR]
    )
);

export const maxYearsSelector = createSelector(
  interimDataQuestionsSelector,
  questions => max(qsByYearLookupSelector(questions), d => d[1])
);

// define xScale after indexByYear has been assigned
export const xScaleSelector = createSelector(
  svgWidthSelector,
  qsByYearLookupSelector,
  (svgWidth, qsByYearLookup) => d =>
    svgWidth * ((1 + d.indexByYear) / (1 + qsByYearLookup.get(d[YEAR])))
);

// position questions that are in filter
export const nodesSelector = createSelector(
  interimDataQuestionsSelector,
  appHeightSelector,
  qsByYearLookupSelector,
  svgWidthSelector,
  xScaleSelector,
  yScaleSelector,
  (questions, appHeight, qsByYearLookup, svgWidth, xScale, yScale) =>
    new Map(
      questions.map(d => [
        d[UID],
        {
          ...d,
          x: d[UID] === "2010_ACS" ? svgWidth - 10 : xScale(d),
          y:
            d[UID] === "2010_ACS"
              ? yScale(d[YEAR]) - appHeight / 6
              : yScale(d[YEAR]),
          r: d[UID] === "2010_ACS" ? 10 : 200 / qsByYearLookup.get(d[YEAR])
        }
      ])
    )
);

export const miniNodesSelector = createSelector(
  interimDataQuestionsSelector,
  nodesSelector,
  (questions, nodes) =>
    questions
      .filter(d => d[AGE_RANGE])
      .map(d => {
        const range = d[AGE_RANGE].split(",");
        const n = range.length;
        const { x, y, r } = nodes.get(d[UID]);
        return range.map((e, i) => {
          const [xi, yi] = getIthPoint(i, n, r - r / n);
          return {
            value: e.trim(),
            x: x + xi,
            y: y + yi,
            r: r / n
          };
        });
      })
      .flat()
);

export const linksSelector = createSelector(
  dataLinksSelector,
  nodesSelector,
  (links, nodes) =>
    links
      .filter(d => nodes.has(d.Source) && nodes.has(d.Target))
      .map(d => {
        // use Category from source node instead of Links file
        const { x: sourceX, y: sourceY, [CATEGORIES]: Category } = nodes.get(
          d.Source
        );
        const { x: targetX, y: targetY } = nodes.get(d.Target);
        if (Category.indexOf(", ") !== -1) {
          Category = "[Multiple]";
        }
        if (Category.indexOf(" - ") !== -1) {
          Category = Category.split(" - ")[0];
        }
        return { ...d, sourceX, sourceY, targetX, targetY, Category };
      })
);
