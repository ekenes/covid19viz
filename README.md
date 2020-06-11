# Viral - Explore COVID-19 data in the United States

This app visualizes COVID-19 data on a U.S. county level.

Data originates from a hosted FeatureLayer, which updates based on [this data](https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series) provided by Johns Hopkins University.

The data contains the total number of people who tested positive for COVID-19 and the total number of deaths for each county on a daily basis. These values exist in one column per day as pipe separated values (e.g. a value of `393 | 14`, indicates the county reported an accumulated total of 393 cases of COVID-19 and 14 deaths as a result of COVID-19).

This app uses expressions to calculate various statistics, such as the total number of infections, new infections, deaths, death rate, doubling time, and the estimated number of people actively sick with COVID-19.

Use the slider to view how this data changed over time.
