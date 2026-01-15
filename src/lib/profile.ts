export type SocialLink = {
  label: string;
  url: string;
  iconSrc: string; // public 아래 경로
  iconSize?: number; // 기본 20
};

export type Profile = {
  name: string;
  locationLabel: string;
  locationUrl: string;
  avatarSrc: string; // public 아래 경로
  avatarBg?: string; // 인라인 background 색(선택)
  bioHtml: string; // <br/> 같은 줄바꿈을 쓰기 위해 HTML로
  links: SocialLink[];
};

export const profiles: Record<string, Profile> = {
  ja: {
    name: 'Kim Jaehee',
    locationLabel: '大韓民国',
    locationUrl: 'https://www.google.com/maps/place/%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD',
    avatarSrc: '/avatar.png',
    avatarBg: 'rgb(252, 242, 230)',
    bioHtml:
      'はじめまして👋<br>開発全般に興味を持ち、いろいろ作ったり試したりしています。<br>気になったことを整理し、制作を通して得た知見をまとめています。',
    links: [
      { label: 'GitHub', url: 'https://github.com/kingmozzi', iconSrc: '/sns/github.svg' },
      // { label: "Wantedly", url: "https://www.wantedly.com/id/...", iconSrc: "/sns/wantedly.svg", iconSize: 32 },
      // { label: "Zenn", url: "https://zenn.dev/...", iconSrc: "/sns/zenn.svg" },
    ],
  },
  ko: {
    name: '김재희',
    locationLabel: '대한민국',
    locationUrl: 'https://www.google.com/maps/place/%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD',
    avatarSrc: '/avatar.png',
    avatarBg: 'rgb(252, 242, 230)',
    bioHtml:
      '안녕하세요 👋<br>개발 전반에 흥미를 느끼며 이것저것 만들고 시도해보고 있습니다.<br>관심 있는 주제와 만들면서 알게 된 것들을 정리해두는 공간입니다.',
    links: [{ label: 'GitHub', url: 'https://github.com/kingmozzi', iconSrc: '/sns/github.svg' }],
  },
  en: {
    name: 'Jaehee Kim',
    locationLabel: 'Korea',
    locationUrl: 'https://www.google.com/maps/place/Korea',
    avatarSrc: '/avatar.png',
    avatarBg: 'rgb(252, 242, 230)',
    bioHtml:
      'Hi 👋<br>I enjoy exploring development as a whole and experimenting with different ideas.<br>This space is for organizing things I find interesting and insights gained through building.',
    links: [{ label: 'GitHub', url: 'https://github.com/kingmozzi', iconSrc: '/sns/github.svg' }],
  },
};
