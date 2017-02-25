import gitRev from 'git-rev-sync';

const version = gitRev.long();

export const getStatus = (req, res) => {
  return res.send({
    data: {
      version
    }
  });
};
