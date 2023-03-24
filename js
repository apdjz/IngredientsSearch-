const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'recipes_db'
});

const recipeUrl = 'https://www.example.com/recipe';

request(recipeUrl, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    const recipeTitle = $('h1.recipe-title').text();
    const ingredients = [];
    $('ul.ingredients li').each(function(i, element) {
      ingredients.push($(this).text().trim());
    });
    const instructions = [];
    $('div.instructions ol li').each(function(i, element) {
      instructions.push($(this).text().trim());
    });

    const recipe = {
      title: recipeTitle,
      ingredients: ingredients.join(', '),
      instructions: instructions.join('\n')
    };

    connection.query('INSERT INTO recipes SET ?', recipe, function (error, results, fields) {
      if (error) throw error;
      console.log(`Recipe saved to database with ID: ${results.insertId}`);
    });
  }
});
