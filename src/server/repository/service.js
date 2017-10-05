const rp = require('request-promise');
const cheerio = require('cheerio');

const getRepository = (userName) => {
  var options = {
    uri: `https://github.com/${userName}?tab=repositories`,
    transform: function(body) {
      return cheerio.load(body);
    }
  };

  const pagination = rp(options)
    .then(function($) {
      let pagination = [];

      $('div.pagination').each(function(index) {
        $(this).text().match(/\d+/g).forEach((page) => pagination.push(page));
      });
      return pagination;
    })
    .catch(function(err) {
      console.log('error', err);
    });

  return new Promise(function(resolve, reject) {
    pagination.then(function(pages) {
      const linguagens = [];
      let promises = null;

      if (pages.length > 0) {
        promises = pages.reduce((promiseChain, page) => {

          var options = {
            uri: `https://github.com/${userName}?page=${page}&tab=repositories`,
            transform: function(body) {
              return cheerio.load(body);
            }
          };

          return promiseChain.then(() => rp(options)
            .then(function($) {

              $('li').filter(function(i, el) {
                return $(this).attr('itemprop') === 'owns' && $(this).find('span').text() && !$(this).find('span').text().trim().startsWith('Forked from');
              }).each(function(index) {

                const starFork = [];

                $(this).find('a.muted-link').each(function(index, data) {
                  starFork[index] = $(data).text().trim().replace(/\n|\r/g, "");
                });

                const language = $(this).find('span').text().replace(/\s/g, '');
                const name = $(this).find('a').attr('itemprop', 'name codeRepository').html().trim().replace(/\n|\r/g, "");
                const stars = starFork[0];
                const forks = starFork[1];

                linguagens.push({ name: name, language: language, stars: stars || '0', forks: forks || '0' });
              });
              return linguagens;
            })
            .catch(function(err) {
              console.log('error', err);
            }));

        }, Promise.resolve());

        promises.then(data => resolve(data));

      } else {

        var options = {
          uri: `https://github.com/${userName}?tab=repositories`,
          transform: function(body) {
            return cheerio.load(body);
          }
        };

        promises = rp(options)
          .then(function($) {
            $('li').filter(function(i, el) {
              return $(this).attr('itemprop') === 'owns' && $(this).find('span').text() && !$(this).find('span').text().trim().startsWith('Forked from');
            }).each(function(index) {
              const starFork = [];

              $(this).find('a.muted-link').each(function(index, data) {
                starFork[index] = $(data).text().trim().replace(/\n|\r/g, "");
              });

              const language = $(this).find('span').text().replace(/\s/g, '');
              const name = $(this).find('a').attr('itemprop', 'name codeRepository').html().trim().replace(/\n|\r/g, "");
              const stars = starFork[0];
              const forks = starFork[1];

              linguagens.push({ name: name, language: language, stars: stars || '0', forks: forks || '0' });
            });
            return linguagens;
          })
          .catch(function(err) {
            console.log('error', err);
          });

        promises.then(data => resolve(data));
      }

    }).catch(err => reject(err));
  });
};

module.exports = {
  getRepository
};