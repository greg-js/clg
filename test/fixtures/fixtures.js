exports.filters = {
  itemPaths: [
    '/this/is/a/path/one.md',
    '/this/is/some/dir/two.markdown',
    '/this/is/a/dir/three.md',
    '/this/is/some/dir/four.html',
    '/this/is/a/path/five.js',
    '/this/is/some/path/six.js',
    '/this/is/a/dir/seven.ejs',
    '/this/is/some/path/eight.jsx'
  ],
  itemObjects: [
    {
      attributes: {
        title: 'Here is a title for this post',
        date: '2016-06-24T16:12:42.370Z'
      },
      path: '/this/is/a/post.md',
      body: 'these are the contents of the first post',
      frontmatter: 'title: Here is a title for this post\ndate: 2016-06-24T16:12:42.370Z',
      fileName: 'post'
    }, {
      attributes: {
        title: 'this is the second post',
        date: '2016-06-23T16:12:42.370Z'
      },
      path: '/this/is/a/second-post.md',
      body: 'some content can be found in here',
      frontmatter: 'title: this is the second post\ndate: 2016-06-23T16:12:42.370Z',
      fileName: 'second-post'
    }, {
      attributes: {
        title: 'Article number three',
        date: '2016-06-22T16:12:42.370Z'
      },
      path: '/this/is/a/article-3.md',
      body: 'this really is one doozy of an article!',
      frontmatter: 'title: Article number three\ndate: 2016-06-22T16:12:42.370Z',
      fileName: 'article-3'
    }, {
      attributes: {},
      path: '/this/is/a/post-without-frontmatter.md',
      body: 'Hello world!',
      fileName: 'post-without-frontmatter'
    }
  ]
};
