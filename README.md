# Todo App

This is a minimal to-do list web app with the following features:

- Add tasks via the input and Add button (or by pressing Enter)
- Persist tasks in `localStorage` so they survive page refreshes
- Mark tasks as complete (using a checkbox)
- Delete a task (click the × button)
- Clear all tasks with the Clear All button
- Accessible labels and basic keyboard support

How to run
1. Open `index.html` in your browser (double-click or use a local server), or run a simple static file server:

```bash
# the simplest: (python 3)
python3 -m http.server 8000
# then open http://localhost:8000
```

Run unit tests
```
# run tests with node
npm test
```

Notes
- Tasks are saved to `localStorage` under the key `todoApp.tasks`.
- Styling is minimal; edit `style.css` to update the look and feel.

Contributing
- Open a PR or modify the project locally to add features (sorting, due dates, editing tasks, etc.).
