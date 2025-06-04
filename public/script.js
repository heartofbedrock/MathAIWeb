document.getElementById('paperForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const topic = document.getElementById('topic').value;
  const grade = document.getElementById('grade').value;
  const exam = document.getElementById('exam').checked;

  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, grade, exam })
  });

  const data = await res.json();
  document.getElementById('output').textContent = data.paper || data.error;
});
