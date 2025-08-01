import { test, expect } from '@playwright/test';

test.describe('새 메모 작성', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 메인 페이지로 이동
    await page.goto('http://localhost:3000');
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('text=📝 메모 앱');
  });

  test('성공 시나리오 - 새 메모를 성공적으로 작성하고 저장', async ({ page }) => {
    // 1. "새 메모" 버튼을 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    
    // 메모 작성 폼이 나타날 때까지 대기
    await page.waitForSelector('text=새 메모 작성');
    
    // 2. "제목" 입력란에 "첫 번째 메모"를 입력
    await page.getByPlaceholder('제목 *').fill('첫 번째 메모');
    
    // 3. "내용" 입력란에 "이것은 첫 번째 메모입니다."를 입력
    await page.getByPlaceholder('메모 내용을 마크다운으로 입력하세요...').fill('이것은 첫 번째 메모입니다.');
    
    // 4. "저장하기" 버튼을 클릭
    await page.getByRole('button', { name: '저장하기' }).click();
    
    // 5. 메모 목록에 "첫 번째 메모"가 나타나는지 확인
    await expect(page.getByRole('heading', { name: '첫 번째 메모' })).toBeVisible();
    
    // 메모 개수가 증가했는지 확인 (기존 2개에서 3개로)
    await expect(page.locator('text=총 3개의 메모')).toBeVisible();
  });

  test('실패 시나리오 - 제목 미입력', async ({ page }) => {
    // 1. "새 메모" 버튼을 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    
    // 메모 작성 폼이 나타날 때까지 대기
    await page.waitForSelector('text=새 메모 작성');
    
    // 2. "내용"만 입력하고 제목은 비워둠
    await page.getByPlaceholder('메모 내용을 마크다운으로 입력하세요...').fill('내용만 있는 메모');
    
    // 3. "저장하기" 버튼을 클릭
    await page.getByRole('button', { name: '저장하기' }).click();
    
    // 4. 제목이 필수라는 내용의 오류 메시지가 표시되는지 확인
    // (실제 구현에 따라 오류 메시지 확인 방법이 달라질 수 있음)
    await expect(page.getByPlaceholder('제목 *')).toBeFocused();
    
    // 폼이 여전히 열려있는지 확인 (저장이 실패했으므로)
    await expect(page.getByText('새 메모 작성')).toBeVisible();
  });

  test('실패 시나리오 - 내용 미입력', async ({ page }) => {
    // 1. "새 메모" 버튼을 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    
    // 메모 작성 폼이 나타날 때까지 대기
    await page.waitForSelector('text=새 메모 작성');
    
    // 2. "제목"만 입력하고 내용은 비워둠
    await page.getByPlaceholder('제목 *').fill('제목만 있는 메모');
    
    // 3. "저장하기" 버튼을 클릭
    await page.getByRole('button', { name: '저장하기' }).click();
    
    // 4. 내용이 필수라는 내용의 오류 메시지가 표시되는지 확인
    // (실제 구현에 따라 오류 메시지 확인 방법이 달라질 수 있음)
    await expect(page.getByPlaceholder('메모 내용을 마크다운으로 입력하세요...')).toBeFocused();
    
    // 폼이 여전히 열려있는지 확인 (저장이 실패했으므로)
    await expect(page.getByText('새 메모 작성')).toBeVisible();
  });

  test('취소 시나리오 - 메모 작성을 취소', async ({ page }) => {
    // 1. "새 메모" 버튼을 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    
    // 메모 작성 폼이 나타날 때까지 대기
    await page.waitForSelector('text=새 메모 작성');
    
    // 일부 내용을 입력
    await page.getByPlaceholder('제목 *').fill('취소될 메모');
    await page.getByPlaceholder('메모 내용을 마크다운으로 입력하세요...').fill('이 메모는 취소됩니다.');
    
    // 2. "취소" 버튼을 클릭
    await page.getByRole('button', { name: '취소' }).click();
    
    // 3. 메모 작성 폼이 사라지는지 확인
    await expect(page.getByText('새 메모 작성')).not.toBeVisible();
    
    // 메모가 추가되지 않았는지 확인 (여전히 2개)
    await expect(page.locator('text=총 2개의 메모')).toBeVisible();
    
    // "취소될 메모"가 목록에 없는지 확인
    await expect(page.getByRole('heading', { name: '취소될 메모' })).not.toBeVisible();
  });

  test('카테고리 선택 테스트', async ({ page }) => {
    // 1. "새 메모" 버튼을 클릭
    await page.getByRole('button', { name: '새 메모' }).click();
    
    // 메모 작성 폼이 나타날 때까지 대기
    await page.waitForSelector('text=새 메모 작성');
    
    // 2. 제목과 내용 입력
    await page.getByPlaceholder('제목 *').fill('업무 메모');
    await page.getByPlaceholder('메모 내용을 마크다운으로 입력하세요...').fill('이것은 업무 관련 메모입니다.');
    
    // 3. 카테고리를 "업무"로 변경
    await page.getByRole('combobox', { name: '카테고리' }).selectOption('업무');
    
    // 4. "저장하기" 버튼을 클릭
    await page.getByRole('button', { name: '저장하기' }).click();
    
    // 5. 메모가 생성되고 "업무" 카테고리로 표시되는지 확인
    await expect(page.getByRole('heading', { name: '업무 메모' })).toBeVisible();
    
    // 카테고리 필터에서 업무 메모 개수가 증가했는지 확인 (1개에서 2개로)
    await expect(page.getByText('업무 (2)')).toBeVisible();
  });
});