const { a, deploy } = require("../lib/utils")

const main = async () => {
  const jpyd = await deploy("JPYD")
  console.log(`JPYD: ${a(jpyd)}`)
}

main()
