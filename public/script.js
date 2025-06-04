let questionBlob = null;
let answerBlob = null;

document.getElementById('paperForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  questionBlob = null;
  answerBlob = null;
  document.getElementById('downloadQuestions').style.display = 'none';
  document.getElementById('downloadAnswers').style.display = 'none';

  const topic = document.getElementById('topic').value;
  const grade = document.getElementById('grade').value;
  const exam = document.getElementById('exam').checked;

  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, grade, exam })
  });

  const outputEl = document.getElementById('output');

  if (!res.ok) {
    const err = await res.json();
    outputEl.textContent = err.error || 'Failed to generate paper';
    return;
  }

  const { questionPdf, answerPdf } = await res.json();

  function b64ToBlob(b64) {
    const binary = atob(b64);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
    return new Blob([arr], { type: 'application/pdf' });
  }

  questionBlob = b64ToBlob(questionPdf);
  answerBlob = b64ToBlob(answerPdf);

  document.getElementById('downloadQuestions').style.display = 'inline-block';
  document.getElementById('downloadAnswers').style.display = 'inline-block';
  outputEl.textContent = 'Papers ready for download';
});

function download(blob, filename) {
  if (!blob) return;
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

document.getElementById('downloadQuestions').addEventListener('click', () => {
  download(questionBlob, 'questions.pdf');
});

document.getElementById('downloadAnswers').addEventListener('click', () => {
  download(answerBlob, 'answers.pdf');
});
