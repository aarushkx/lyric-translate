"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { IMaterials } from "@/types";

interface ExampleSentencesProps {
    exampleSentences: IMaterials["exampleSentences"];
}

const ExampleSentences = ({ exampleSentences }: ExampleSentencesProps) => {
    return (
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-border bg-card/70">
                <h2 className="text-lg font-semibold text-card-foreground">
                    Example Sentences
                </h2>
            </div>
            <div className="p-4 bg-card/50 divide-y divide-border">
                {exampleSentences.map((item, index) => (
                    <div key={index} className="py-3 first:pt-0 last:pb-0">
                        <div className="font-medium text-card-foreground">
                            <ReactMarkdown
                                children={item.sentence}
                                rehypePlugins={[rehypeRaw]}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {item.meaning}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExampleSentences;
