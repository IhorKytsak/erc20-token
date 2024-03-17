export const content = {
  metadataTemplate: (tokenId: number, attributes: any) => ({
    name: `NFT #${tokenId}`,
    description: `This is a description of the NFT #${tokenId}`,
    image: `imageURL`,
    attributes: attributes,
  }),
  layers: [
    {
      name: 'background',
      probability: 1.0,
      options: [
        {
          name: 'light-blue',
          file: 'light-blue.png',
          weight: 1,
        },
        {
          name: 'blue-gradient',
          file: 'blue-gradient.png',
          weight: 1,
        },
        {
          name: 'green',
          file: 'green.png',
          weight: 1,
        },
        {
          name: 'green-gradient',
          file: 'green-gradient.png',
          weight: 1,
        },
        {
          name: 'light-green-gradient',
          file: 'light-green-gradient.png',
          weight: 1,
        },
        {
          name: 'light-blue-gradient',
          file: 'light-blue-gradient.png',
          weight: 1,
        },
        {
          name: 'light-pink',
          file: 'light-pink.png',
          weight: 1,
        },
        {
          name: 'pink-gradient',
          file: 'pink-gradient.png',
          weight: 1,
        },
        {
          name: 'light-pink-gradient',
          file: 'light-pink-gradient.png',
          weight: 1,
        },
        {
          name: 'multi-color-grandient',
          file: 'multi-color-grandient.png',
          weight: 0.25,
        },
        {
          name: 'yellow',
          file: 'yellow.png',
          weight: 0.5,
        },
      ],
    },
    {
      name: 'body',
      probability: 1.0,
      options: [
        {
          name: 'body',
          file: 'body.png',
          weight: 1,
        },
      ],
    },
    {
      name: 'bulb',
      probability: 1.0,
      options: [
        {
          name: 'blank',
          file: 'blank.png',
          weight: 1,
        },
        {
          name: 'blue',
          file: 'blue.png',
          weight: 1,
        },
        {
          name: 'normal',
          file: 'normal.png',
          weight: 1,
        },
        {
          name: 'orange',
          file: 'orange.png',
          weight: 1,
        },
        {
          name: 'purple',
          file: 'purple.png',
          weight: 0.25,
        },
        {
          name: 'yellow',
          file: 'yellow.png',
          weight: 0.5,
        },
      ],
    },
    {
      name: 'middle-color',
      probability: 1.0,
      options: [
        {
          name: 'color',
          file: 'color.png',
          weight: 1,
        },
        {
          name: 'cyan',
          file: 'cyan.png',
          weight: 1,
        },
        {
          name: 'light-blue',
          file: 'light-blue.png',
          weight: 1,
        },
        {
          name: 'light-orange',
          file: 'light-orange.png',
          weight: 1,
        },
        {
          name: 'light-rose',
          file: 'light-rose.png',
          weight: 0.25,
        },
        {
          name: 'light-yellow',
          file: 'light-yellow.png',
          weight: 0.5,
        },
        {
          name: 'orange',
          file: 'orange.png',
          weight: 0.5,
        },
        {
          name: 'purple',
          file: 'purple.png',
          weight: 0.5,
        },
        {
          name: 'red',
          file: 'red.png',
          weight: 0.5,
        },
        {
          name: 'rose',
          file: 'rose.png',
          weight: 0.5,
        },
        {
          name: 'yellow',
          file: 'yellow.png',
          weight: 0.5,
        },
      ],
    },
    {
      name: 'question',
      probability: 1.0,
      options: [
        {
          name: 'blank',
          file: 'blank.png',
          weight: 1,
        },
        {
          name: 'blue',
          file: 'blue.png',
          weight: 1,
        },
        {
          name: 'creem',
          file: 'creem.png',
          weight: 1,
        },
        {
          name: 'greeny-yellow',
          file: 'greeny-yellow.png',
          weight: 1,
        },
        {
          name: 'normal',
          file: 'normal.png',
          weight: 1,
        },
        {
          name: 'pink',
          file: 'pink.png',
          weight: 1,
        },
        {
          name: 'red',
          file: 'red.png',
          weight: 1,
        },
      ],
    },
  ],
}
