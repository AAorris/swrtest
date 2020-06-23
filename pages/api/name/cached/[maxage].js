// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const names = ['Olmo', 'Robert', 'Aaron']

export default (req, res) => {
    res.statusCode = 200
    const { query: { maxage } } = req 
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            res.setHeader('Cache-Control', `s-maxage=${maxage}, stale-while-revalidate`);
            res.json({ name: names[Math.floor(Math.random() * 3)] })
            resolve()
        }, (1000 + Math.random() * 1000))
    })
  }