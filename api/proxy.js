// api/proxy.js
export default async function handler(req, res) {
  // Vercel 환경변수에서 몰래 꺼내옴 (브라우저 노출 X)
  const GAS_URL = process.env.GAS_URL;
  const SECRET_TOKEN = process.env.SECRET_TOKEN;

  if (!GAS_URL || !SECRET_TOKEN) {
    return res.status(500).json({ error: "서버 설정 오류: 환경변수 누락" });
  }

  try {
    if (req.method === 'GET') {
      // 상품 목록 가져오기 (구글 주소 뒤에 비밀키를 몰래 붙여서 전송)
      const fetchUrl = `${GAS_URL}?token=${SECRET_TOKEN}`;
      const response = await fetch(fetchUrl);
      const data = await response.json();
      res.status(200).json(data);
    } 
    else if (req.method === 'POST') {
      // 주문하기 (클라이언트가 보낸 데이터에 비밀키를 몰래 끼워넣어서 전송)
      const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      bodyData.secretToken = SECRET_TOKEN;

      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(bodyData)
      });
      const data = await response.json();
      res.status(200).json(data);
    } 
    else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
