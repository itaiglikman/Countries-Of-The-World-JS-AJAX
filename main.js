// //jquery path:
/// <reference path="jquery-3.7.0.js"/>

"use strict";

// document-ready jQuery:
$(() => {

    main();

    // function will control and activate the button clicks:
    async function main() {

        // prevent from submission:
        $("form").submit(function (event) {
            event.preventDefault();
        });

        // on all button click display all countries:
        $("#allBtn").on("click", async () => {
            displayAllCountries();
        });
        
        // on search button click activate the search functions:
        $("#searchBtn").on("click", () => {
            displaySearchedCountries();
        });
    }

    // functions will get the array with the API of all countries,
    // display the stats table:
    async function displayAllCountries() {
        // get api:
        let allCountriesArr = await ALL();
        
        // display stats table:
        displayStats(allCountriesArr);
        
    }
    
    // functions will get the value of the search and make validation,
    // if all valid - display the stats table:
    // else: alert the error to the user:
    async function displaySearchedCountries() {
        try {

            // get search value:
            let search = getSearch();

            // if search is empty on send return error:
            if (search === "") throw new Error("if you want to search specific countries you have to insert something to the search box");
            
            // get api array:
            let searchedCountriesArr = await NAME(search);
            
            // if array is empty return error:
            if (searchedCountriesArr.status === 404) throw new Error("couldn't find the countries you were looking for");

            // display stats:
            displayStats(searchedCountriesArr);

        } catch (err) {
            alert(err.message);
        }
    }

    // function get the API array,
    // display all stats:
    function displayStats(countriesArr) {
        let countries = numOfCountries(countriesArr)
        let popul = population(countriesArr)

        // display number of countries,
        $("#totalCountries").html(countries)

        // total population in all country,
        $("#totalPopulation").html(popul);

        // average population in each country,
        $("#avgPopulation").html(avgPopulation(countries, popul));

        // display the country name table,
        displayCountryNameTable(countriesArr);

        // display the regions table:
        displayCountryRegionTable(countriesArr);

    }
    
    // function get the API array,
    // make a map which contains all regions and the number of country in each region:
    function displayCountryRegionTable(countriesArr) {
        let mapOfRegions = new Map();
        
        // run over the array and check - 
        // if region already exists - add 1 to count,
        // else - set a new region:
        for (const item of countriesArr) {
            let region = item.region;
            if (mapOfRegions.has(region)) {
                mapOfRegions.set(region, mapOfRegions.get(region) + 1);
            }
            else {
                mapOfRegions.set(region, 1);
            }
        }

        // display on html:
        let html = `
        <table class="table table-dark table-striped">
        <thead>
        <th>region</th>
        <th>number of countries</th>
        </thead>
        <tbody>
        `;
        
        // run over the map, use key and value to get the stats:
        // mapOfRegions.forEach(function (key, value) {
        mapOfRegions.forEach(function (value, key) {
            html += `
            <tr>
                <td>${key}</td>
                <td>${value}</td>
                </tr>
                `;
            });
            
        html += `
        </tbody>
        </table>
        `;
        
        $("#regionsTable").html(html);
        
    }
    
    // function get the API array,
    // make a table with all names and population of each country in the array:
    function displayCountryNameTable(countriesArr) {
        let html = `
        <table class="my-table table table-dark table-striped">
        <thead>
            <th>name</th>
            <th>number of residents</th>
        </thead>
        <tbody>
        `;

        for (const item of countriesArr) {
            html += `
            <tr>
                <td>${item.name.common}</td>
                <td>${item.population}</td>
            </tr>    
            `;
        }

        html += `
        </tbody>
        </table><br><br><br><br>
        `;

        $("#countryNameTable").html(html);

    }



    // function will get the value from the search box and return it:
    function getSearch() {
        let search = $("#searchBox").val();
        return search;
    }

    // function get the API array,
    // calc the num of countries and return it:
    function numOfCountries(countriesArr) {
        let num = countriesArr.length;
        return num;
    }
    
    // function get the API array,
    // calc the sum of the population of countries and return it:
    function population(countriesArr) {
        let sum = 0;
        for (const item of countriesArr) {
            sum += item.population;
        }
        return sum;
    }
    
    // function get the countries number and sum of population,
    // calc the avg of the population of all countries and return it:
    function avgPopulation(countries, population) {
        let avg = population / countries;
        return Math.floor(avg);
    }

    // API call for all countries
    async function ALL() {
        let response = await fetch("https://restcountries.com/v3.1/all ");
        let json = await response.json();
        return json;
    }

    // API call for searched countries
    async function NAME(name) {
        let response = await fetch(`https://restcountries.com/v3.1/name/${name} `);
        let json = await response.json();
        return json;
    }

})