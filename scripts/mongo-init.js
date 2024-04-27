db.createUser({
  user: 'testuser',
  pwd: 'testpassword',
  roles: [
    {
      role: 'readWrite',
      db: 'testdb'
    }
  ]
});
