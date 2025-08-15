const $search = document.querySelector("#search");
const $inputname = document.querySelector("#inputname");
const $result = document.querySelector("#result");

$search.addEventListener("click", function() {
  const handle = $inputname.value.trim();
  if (handle) {
    getStats(handle);
  }
});

let currentRequest = null;

async function getStats(handle) {
  if (currentRequest) {
    currentRequest.abort();
  }
  $result.innerHTML = "불러오는 중...";

  const controller = new AbortController();
  currentRequest = controller;

  try {
    const apiUrl = `https://solved.ac/api/v3/user/show?handle=${handle}`;
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const res = await fetch(proxyUrl + encodeURIComponent(apiUrl),{
        signal: controller.signal
    });
    if (controller.signal.aborted) return;

    const response = await res.json();
    const data = JSON.parse(response.contents);

    if (data.handle !== handle) {
      throw new Error(`잘못된 응답: 요청=${handle}, 응답=${data.handle}`);
    }
    
    $result.innerHTML = `
      <div class="stat">닉네임: ${data.handle}</div>
      <div class="stat">티어: <img src="https://static.solved.ac/tier_small/${data.tier}.svg" alt="티어"> (${data.tier})</div>
      <div class="stat">랭크: ${data.rank}</div>
      <div class="stat">최대 스트릭: ${data.maxStreak}</div>
      <div class="stat">해결 문제 수: ${data.solvedCount}</div>
    `;
  } catch (error) {
    $result.innerHTML = `<div style="color:red;">${error.message}</div>`;
  }
}