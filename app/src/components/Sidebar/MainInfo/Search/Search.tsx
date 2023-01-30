import {
  mdiChevronRight,
  mdiChevronUp,
  mdiFilterVariant,
  mdiMagnify,
  mdiSwapVertical,
} from "@mdi/js";
import Icon from "@mdi/react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Slider,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./Search.module.scss";
import SearchItem from "./SearchItem/SearchItem";
import { useMainContext } from "../../../Layout/Layout";
import { useRouter } from "next/router";
import Spinner from "../../../Spinner";
import Link from "next/link";
import { motion as m } from "framer-motion";
import en from "../../../../locales/en";
import de from "../../../../locales/de";

const Search = () => {
  const router = useRouter();
  const t = router.locale === "en" ? en : de;
  const { pathArray: queryPaths } = router.query;
  var pathArray = queryPaths as string[];
  const {
    searchResults,
    setSearchResults,
    lat,
    setLat,
    lon,
    setLon,
    suggestionStations,
    distance,
    setDistance,
    maxResults,
    setMaxResults,
  } = useMainContext();

  const [filterContainerOpen, setFilterContainerOpen] =
    useState<boolean>(false);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [textSearchResults, setTextSearchResults] = useState<any[]>([]);

  const [selectedYearRange, setSelectedYearRange] = useState<number[]>([
    1750, 2023,
  ]);

  // all years: array from 1750 to 2023
  const allYears = Array.from({ length: 2023 - 1750 + 1 }, (_, i) => 1750 + i);
  // exclude years: We have no data for the years from 1751 to 1762
  const excludeYears = Array.from(
    { length: 1762 - 1751 + 1 },
    (_, i) => 1751 + i
  );
  const years = allYears.filter((year) => !excludeYears.includes(year));

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) return;
    // if the value is in the excluded range, set it to the closest value in the range
    if (excludeYears.includes(newValue[0])) {
      if (newValue[0] <= 1751) {
        newValue[0] = 1750;
      } else {
        newValue[0] = 1763;
      }
    }

    setSelectedYearRange(newValue as number[]);
  };

  const handleSearch = async () => {
    if (lat === null || lon === null || lat === undefined || lon === undefined)
      return;
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) return;
    try {
      const res = await fetch(
        `/api/station?lat=${parseFloat(lat)}&lon=${parseFloat(
          lon
        )}&distance=${distance.toFixed(2)}&size=${maxResults.toFixed(0)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setSearchResults(data);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTextSearch = async (e: any, value: string) => {
    if (value === "") {
      setTextSearchResults([]);
      return;
    }
    try {
      setIsSearchLoading(true);

      const res = await fetch(`/api/station/search?q=${value}&size=5`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const results = await res.json();
      const data = results.map((result: any) => {
        return {
          name: result._source.id,
          id: result._source.id,
        };
      });
      setTextSearchResults(data);
      setIsSearchLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(textSearchResults);

  useEffect(() => {
    // add event listener to listen for keypresses
    // if keypress is enter, call handleSearch

    window.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });

    return () => {
      // remove event listener
      window.removeEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      });
    };
  }, []);

  // use Effect to add lat and lon to url
  useEffect(() => {
    if (!lat || !lon) return;
    if (isNaN(Number(lat)) || isNaN(Number(lon))) return;
    router.push(
      {
        pathname: "/search",
        query: { lat, lon },
      },
      undefined,
      { shallow: true }
    );
  }, [lat, lon]);

  const handleFilterContainerOpen = () => {
    setFilterContainerOpen(!filterContainerOpen);
  };

  const filterContainerVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const handleSearchOpen = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const searchContainerVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    closed: {
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
      display: "none",
    },
  };

  return (
    <>
      {pathArray && pathArray.length === 1 ? (
        <>
          <div className={styles.searchContainer}>
            <m.div
              className={styles.innerSearchContainer}
              style={{ flex: 1 }}
              variants={searchContainerVariants}
              animate={isSearchOpen ? "closed" : "open"}
            >
              <TextField
                label={t.searching.latitude}
                variant="outlined"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
                name="lat"
                size="small"
                type={"number"}
              />
              <TextField
                label={t.searching.longitude}
                variant="outlined"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                required
                name="lon"
                size="small"
                type={"number"}
              />
            </m.div>
            <m.div
              className={styles.innerSearchContainer}
              style={{ flex: 1 }}
              variants={searchContainerVariants}
              animate={isSearchOpen ? "open" : "closed"}
            >
              <Autocomplete
                id="station-search"
                options={textSearchResults}
                getOptionLabel={(option) => option.name}
                freeSolo
                loading={isSearchLoading}
                onInputChange={(e, value) => handleTextSearch(e, value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    autoComplete="on"
                    placeholder={t.searching.name}
                    label={t.searching.search}
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <Icon path={mdiMagnify} size={0.9} color="#FFF" />
                      ),
                      endAdornment: (
                        <>
                          {isSearchLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    size="small"
                  />
                )}
                sx={{ width: "100%" }}
              />
            </m.div>

            <IconButton onClick={() => handleSearchOpen()}>
              <Icon path={mdiSwapVertical} size={1} />
            </IconButton>
          </div>
          <div className={styles.filterContainer}>
            <m.div
              variants={filterContainerVariants}
              initial="closed"
              animate={filterContainerOpen ? "open" : "closed"}
              className={styles.filter}
            >
              <Box
                sx={{
                  width: "100%",
                  position: "relative",
                  marginTop: "1rem",
                  zIndex: 1,
                }}
              >
                <Autocomplete
                  multiple={false}
                  id="country-select"
                  options={suggestionStations?.map((station) => ({
                    value:
                      station.top_country_hits.hits.hits[0]._source
                        .country_code,
                    label:
                      station.top_country_hits.hits.hits[0]._source
                        .country_name,
                  }))}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={t.searching.country}
                      placeholder={t.searching.country}
                      size="small"
                    />
                  )}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "2rem",
                }}
              >
                <Slider
                  value={selectedYearRange}
                  getAriaLabel={() => t.searching.year_rang}
                  onChange={handleChange}
                  step={1}
                  min={Math.min(...years)}
                  max={Math.max(...years)}
                  valueLabelDisplay="auto"
                  disableSwap
                  marks={[
                    {
                      value: 1750,
                      label: "1750",
                    },
                    {
                      value: 1825,
                      label: "1825",
                    },
                    {
                      value: 1900,
                      label: "1900",
                    },
                    {
                      value: 1975,
                      label: "1975",
                    },
                    {
                      value: 2023,
                      label: "2023",
                    },
                  ]}
                  sx={{
                    width: 220,
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  width: "100%",
                  marginBottom: "1rem",
                }}
              >
                <FormControl sx={{ width: "12ch" }} variant="outlined">
                  <OutlinedInput
                    id="distance"
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    endAdornment={
                      <InputAdornment position="end">km</InputAdornment>
                    }
                    aria-describedby="distance-helper-text"
                    inputProps={{
                      "aria-label": "distance",
                    }}
                    sx={{
                      height: "2.5rem",
                    }}
                  />
                  <FormHelperText id="distance-helper-text">
                    Radius
                  </FormHelperText>
                </FormControl>
                <FormControl sx={{ width: "15ch" }} variant="outlined">
                  <OutlinedInput
                    id="max-results"
                    type="number"
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
                    aria-describedby="max-results-helper-text"
                    inputProps={{
                      "aria-label": "max-results",
                    }}
                    sx={{
                      height: "2.5rem",
                    }}
                  />
                  <FormHelperText id="max-results-helper-text">
                    {t.searching.results}
                  </FormHelperText>
                </FormControl>
              </Box>
            </m.div>
            <div className={styles.actionBar}>
              <Button
                variant="outlined"
                startIcon={
                  filterContainerOpen ? (
                    <Icon path={mdiChevronUp} size={1} />
                  ) : (
                    <Icon path={mdiFilterVariant} size={1} />
                  )
                }
                onClick={handleFilterContainerOpen}
              >
                {filterContainerOpen ? t.searching.hide : t.searching.show}
              </Button>
              <Button variant="outlined" onClick={handleSearch} color="primary">
                {t.searching.search}
              </Button>
            </div>
          </div>
          {searchResults?.length === 0 && (
            <div className={styles.noResults}>No results</div>
          )}
          {searchResults?.length > 0 && (
            <div className={styles.resultsContainer}>
              {searchResults?.map((result) => (
                <SearchItem result={result} key={result._id} />
              ))}
            </div>
          )}
          {(searchResults === null || searchResults === undefined) && (
            <>
              <div className={styles.suggestions}>
                <div className={styles.suggestionContainer}>
                  <div className={styles.suggestionContainerHeader}>
                    <div className={styles.suggestionContainerHeaderLeft}>
                      <h2 className={styles.suggestionContainerHeaderTitle}>
                        {t.searching.world}
                      </h2>
                      <h3 className={styles.suggestionContainerHeaderSubtitle}>
                        {t.searching.check}
                      </h3>
                    </div>
                  </div>
                  <div className={styles.suggestionContainerBody}>
                    {suggestionStations.length === 0 && (
                      <div className="flex justify-center items-center">
                        <Spinner />
                      </div>
                    )}
                    {suggestionStations.length > 0 &&
                      suggestionStations
                        .slice(0, 10)
                        .map((suggestion) => (
                          <SearchItem
                            result={suggestion.top_country_hits.hits.hits[0]}
                            key={suggestion.top_country_hits.hits.hits[0]._id}
                          />
                        ))}
                    {suggestionStations.length > 0 && (
                      <div className={styles.suggestionContainerBodyMore}>
                        <div className={styles.borderContainer}>
                          <div className={styles.border} />
                        </div>
                        <Link href={`/search/stations-across-the-globe`}>
                          <div className={styles.itemContainer}>
                            <div className={styles.itemTitleContainer}>
                              <div className={styles.title}>
                                {`See all ${suggestionStations.length} countries`}
                              </div>
                            </div>

                            <div className={styles.itemIconContainer}>
                              <div className={styles.icon}>
                                <Icon path={mdiChevronRight} size={1} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className={styles.suggestions}>
            {suggestionStations.length === 0 && (
              <div className="flex justify-center items-center">
                <Spinner />
              </div>
            )}
            {suggestionStations.length > 0 &&
              suggestionStations.map((suggestion) => (
                <SearchItem
                  result={suggestion.top_country_hits.hits.hits[0]}
                  key={suggestion.top_country_hits.hits.hits[0]._id}
                />
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default Search;
