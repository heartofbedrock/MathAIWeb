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
  
  if (!res.ok) {
    const err = await res.json();
    document.getElementById('output').textContent = err.error || 'Failed to generate paper';
    return;
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'paper.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
  document.getElementById('output').textContent = 'Download started';
});
