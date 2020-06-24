// pages/api/date.js

const withDelay = ms => callback => (req, res) => 
    setTimeout(() => callback(req, res), ms)

export default withDelay(1000)((req, res) => {
    res.setHeader(
      'Cache-Control',
      's-maxage=1, stale-while-revalidate'
    );
    res.json({date: new Date().toISOString()})
})