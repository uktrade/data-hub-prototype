exports.config = {
  directConnect: true,
  capabilities: {
    'browserName': 'chrome'
  },

  specs: ['./specs/*-spec.js'],

  jasmineNodeOpts: {
    showColors: true // Use colors in the command line report.
  },

  plugins: [{
    package: 'jasmine2-protractor-utils',
    disableHTMLReport: false,
    disableScreenshot: false,
    screenshotPath: './reports/screenshots',
    screenshotOnExpectFailure: true,
    screenshotOnSpecFailure: true,
    clearFoldersBeforeTest: true,
    htmlReportDir: './reports/htmlReports',
    failTestOnErrorLog: {
      failTestOnErrorLogLevel: 900,
      excludeKeywords: ['keyword1', 'keyword2']
    }
  }]

};
