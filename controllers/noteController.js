const Note = require('../models/note');

const note_index = (req, res) => {
  Note.find().sort()
    .then(result => {
      res.render('index', { notes: result, title: 'All notes' });
    })
    .catch(err => {
      console.log(err);
    });
}

const note_details = (req, res) => {
  const id = req.params.id;
  Note.findById(id)
    .then(result => {
      res.render('details', { note: result, title: 'Note Details' });
    })
    .catch(err => {
      console.log(err);
      res.render('404', { title: 'Note not found' });
    });
}

const note_create_get = (req, res) => {
  res.render('create', { title: 'Create a new note' });
}

const note_create_post = (req, res) => {
  const note = new Note(req.body);
  note.save()
    .then(result => {
      console.log(req.body);
      res.redirect('/notes');
    })
    .catch(err => {
      console.log(err);
    });
}

const note_update_get = (req,res) => {
  const id = req.params.id;
  Note.findById(id)
    .then(result => {
      res.render('update', { note: result, title: 'Update a Note' });
    })
    .catch(err => {
      console.log(err);
      res.render('404', { title: 'Note not found' });
    });
}

const note_update_post = (req, res) => {
  const id = req.params.id; 
  const note = new Note(req.body);
  const text = note.body
  // console.log(id,text)
  Note.findByIdAndUpdate(id, {body: text}, {useFindAndModify: false})
  .then(result => {
    res.redirect('/notes/'+id);
  })
  .catch(err => {
    res.status(500)
    console.log(err)
  })
}

const note_delete = (req, res) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/notes' });
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
  note_index, 
  note_details, 
  note_create_get, 
  note_create_post,
  note_update_get,
  note_update_post, 
  note_delete
}