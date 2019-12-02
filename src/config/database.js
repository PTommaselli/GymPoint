module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gympoint',
  define: {
    timestampp: true,
    underscored: true,
    underscoredAll: true,
  },
};
