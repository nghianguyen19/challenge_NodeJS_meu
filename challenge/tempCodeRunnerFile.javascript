'use strict';

const fs = require('fs');
const https = require('https');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;
process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});
function readLine() {
    return inputString[currentLine++];
}
async function getTeams(year, k) {
    const fetch = (url) => new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });

    const BASE_URL = `https://jsonmock.hackerrank.com/api/football_matches?competition=UEFA%20Champions%20League&year=${year}&page=`;

    let page = 1;
    let totalPages = 1;
    const teamMatches = {}; 

    while (page <= totalPages) {
        const response = await fetch(BASE_URL + page);
        totalPages = response.total_pages;

        for (const match of response.data) {
            const { team1, team2 } = match;

            teamMatches[team1] = (teamMatches[team1] || 0) + 1;
            teamMatches[team2] = (teamMatches[team2] || 0) + 1;
        }

        page++;
    }

   
    return Object.entries(teamMatches)
        .filter(([team, count]) => count >= k)
        .map(([team]) => team)
        .sort();
}

async function main() {
  const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

  const year = parseInt(readLine().trim());
  const k = parseInt(readLine().trim());

  const teams = await getTeams(year, k);

  for (const team of teams) {
    ws.write(`${team}\n`);
  }
}
