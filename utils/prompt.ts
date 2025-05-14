export const TRANSLATE_LYRICS_PROMPT = (
    lyrics: string,
    targetLanguage: string = "English"
) => `
Translate the following song lyrics into ${targetLanguage} following these rules:

1. Format each line exactly like this, and **bold** both the original lyrics:
   **Original lyrics**<br />Translated lyrics<br />

   - Use double asterisks (**) to bold the original lyrics
   - Use *italics* for the romanized version (if applicable)
   - Use <br /> at the end of each line, including:
     - After the original lyrics
     - After the romanized line (if any)
     - After the translated line

2. Preservation Guidelines:
   - Maintain the original meaning and emotional tone
   - Keep line breaks and section structure identical
   - Preserve song structure markers like [Verse], [Chorus]
   - Maintain capitalization of proper nouns and names

3. Special Cases:
   - For untranslatable wordplay, keep original and add [approx: translation]
   - For cultural references, keep original and add [cultural note]
   - If the original language is not written in the Latin (English) alphabet, include a romanized version under the original line like this:

   **Original lyrics**<br />*Romanized version*<br />Translated lyrics<br />
   
   - Never add extra explanations unless marked in brackets

Example Output:
**Siempre hay alguien como tú**<br />There's always someone like you<br />

**मैं हूँ यहीं पर**<br />*Main hoon yahin par*<br />I am right here<br />

Now translate these lyrics:
${lyrics}

Important:
- The response **must use valid Markdown syntax** so bold and line breaks are rendered correctly
- Every original lyric, romanized version (if any), and translated line must end with an additional like <br /><br />
- Only return the formatted translation pairs
- Don't include any additional commentary
- Don't include any metadata, contributor info, descriptions, or extra lines that appear before the actual lyrics begin
- Preserve all original line breaks and section headers (e.g., [Verse 1])
`;

export const GENERATE_VOCAB_AND_SENTENCES_PROMPT = (
    translatedLyrics: string
) => `
Given these bilingual song lyrics in the format:

**Original Phrase**  
*Romanized version (if applicable)*  
Translation (plain text)

${translatedLyrics}

Your task:

1. Extract 10 useful vocabulary words from the song and provide their translations.
   - Use **bold** for original words.
   - Use *italics* for romanized versions (if the script is non-Latin).
   - Provide a plain translation.
   - Focus on commonly useful verbs, nouns, adjectives, or set phrases.
   - Avoid names, pronouns, or very rare words.

2. Write 10 original, natural, and useful example sentences that:
   - Use some of the extracted vocabulary or reflect grammar structures found in the song.
   - Are NOT poetic, rhyming, or stylized — they must sound like normal everyday language.
   - Preserve the grammatical complexity of the song (e.g., tense, sentence construction).
   - Are accurate, clear, and helpful for a beginner/intermediate learner.
   - Follow this format:
     - **Original Sentence**
     - *Romanized version (if needed)*
     - Translation

Return your response in this valid JSON format:
{
  "vocabulary": [
    {
      "word": "**original word** (*romanized form if needed*)",
      "meaning": "translation"
    }
  ],
  "exampleSentences": [
    {
      "sentence": "**original sentence**<br />*romanized (if needed)*",
      "meaning": "translation"
    }
  ]
}

Important Guidelines:
- Do NOT copy or paraphrase lines from the song.
- Do NOT make sentences rhyme or sound poetic.
- Ensure each sentence is practical and grammatically sound.
- Use romanized forms *only if* the language is in a non-Latin script.
- Think like a language tutor helping learners understand how to use grammar and vocabulary in real life.
`;
