export const TRANSLATE_LYRICS_PROMPT = (
    lyrics: string,
    targetLanguage: string = "English"
) => `
Translate the following song lyrics into ${targetLanguage} following these rules:

1. Format each line exactly like this:
   **Original lyrics**
   Translated lyrics

2. Preservation Guidelines:
   - Maintain the original meaning and emotional tone
   - Keep line breaks and section structure identical
   - Preserve song structure markers like [Verse], [Chorus]
   - Maintain capitalization of proper nouns and names

3. Special Cases:
   - For untranslatable wordplay, keep original and add [approx: translation]
   - For cultural references, keep original and add [cultural note]
   - If the original language is not written in the Latin (English) alphabet, include a romanized version under the original line like this:
   **Original lyrics**
   *Romanized version*
   Translated lyrics
   - Never add extra explanations unless marked in brackets

Example Output:
**Siempre hay alguien como tú**
There's always someone like you

**मैं हूँ यहीं पर**
**Main hoon yahin par**
I am right here

Now translate these lyrics:
${lyrics}

Important:
- Only return the formatted translation pairs
- Don't include any additional commentary
- Don't include any metadata, contributor info, descriptions, or extra lines that appear before the actual lyrics begin
- Maintain all original line breaks
- Keep section headers like [Verse 1] unchanged
`;

export const GENERATE_VOCAB_AND_SENTENCES_PROMPT = (
    translatedLyrics: string
) => `
Given these bilingual song lyrics in format:
**Original Language Phrase**
**Romanized version as well if non-Latin alphabet is used**
Translation

${translatedLyrics}

Generate:
1. 10 important vocabulary words from the song with their translations
2. 10 example sentences that:
   - Use similar grammatical structures as the original lyrics
   - Contain different vocabulary/context
   - Maintain the same language complexity
   - Are natural and grammatically correct

Return as JSON with this exact structure:
{
  "vocabulary": [
    {
      "word": "original word (romanized as well if non-Latin alphabet)",
      "meaning": "translation"
    }
  ],
  "exampleSentences": [
    {
      "sentence": "sentence using similar structure (romanized as well if non-Latin alphabet)",
      "meaning": "translation"
    }
  ]
}

Guidelines:
- Select vocabulary that's useful for language learners
- Example sentences should demonstrate the grammar patterns from the song
- Keep the same tense, mood, and grammatical constructions
- Ensure all translations are accurate
- Do not copy exact phrases from the song
- If original lyrics are in a non-Latin script, use their romanized form in vocabulary too
`;
