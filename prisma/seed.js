const { execSync } = require('child_process')

const runSeed = () => {
  try {
    execSync('tsx prisma/seed.ts', { stdio: 'inherit' })
  } catch (error) {
    console.error('Erro ao executar seed:', error)
    process.exit(1)
  }
}

runSeed()
