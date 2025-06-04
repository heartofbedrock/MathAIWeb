let questionBlob = null;
let answerBlob = null;

function startLoading() {
  const container = document.getElementById('progressContainer');
  const bar = document.getElementById('progressBar');
  let width = 0;
  container.style.display = 'block';
  bar.style.width = '0%';
  return setInterval(() => {
    width = (width + 5) % 100;
    bar.style.width = width + '%';
  }, 200);
}

function stopLoading(interval) {
  clearInterval(interval);
  document.getElementById('progressContainer').style.display = 'none';
}

async function generatePaper(e) {
  e.preventDefault();
  questionBlob = null;
  answerBlob = null;
  document.getElementById('downloadQuestions').style.display = 'none';
  document.getElementById('downloadAnswers').style.display = 'none';

  const topic = document.getElementById('topic').value;
  const grade = document.getElementById('grade').value;
  const exam = document.getElementById('exam').checked;

  const outputEl = document.getElementById('output');
  outputEl.textContent = 'Generating paper...';
  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  const interval = startLoading();

  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, grade, exam })
  });

  stopLoading(interval);
  btn.disabled = false;

  if (!res.ok) {
    const err = await res.json();
    outputEl.textContent = err.error || 'Failed to generate paper';
    return;
  }

  const { questionPdf, answerPdf } = await res.json();
  questionBlob = b64ToBlob(questionPdf);
  answerBlob = b64ToBlob(answerPdf);
  document.getElementById('downloadQuestions').style.display = 'inline-block';
  document.getElementById('downloadAnswers').style.display = 'inline-block';
  outputEl.textContent = 'Papers ready for download';
}

  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
});
document.getElementById('downloadAnswers').addEventListener('click', () => {
  if (!answerBlob) return;
  const url = window.URL.createObjectURL(answerBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'answers.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
});
