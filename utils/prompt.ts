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
   - Never add extra explanations unless marked in brackets

Example Output:
**Siempre hay alguien como tú**
There's always someone like you

**Que te nubla la razón**
Who clouds your judgment

Now translate these lyrics:
${lyrics}

Important:
- Only return the formatted translation pairs
- Don't include any additional commentary
- Maintain all original line breaks
- Keep section headers like [Verse 1] unchanged
`;
