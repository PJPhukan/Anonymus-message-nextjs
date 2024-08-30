"use client";

import * as React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
export default function Home() {
  return (
    <>
      <section className="w-full">
        <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
          <section className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold">
              Drive into the World of Anonymus Conversations
            </h1>
            <p className="mt-3 md:mt-4 text-base">
              Explore Mystry Message - Where your identity remains a secret
            </p>
          </section>
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full max-w-xs"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="w-full">
                  <div className="p-1">
                    <Card className="bg-blue-100">
                      <CardHeader>
                        <h1 className="text-xl text-center">{message.title}</h1>
                      </CardHeader>
                      <CardContent>
                        <h4 className="text-center">{message.content}</h4>
                        <p className="mt-4 text-center">{message.received}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </main>
        <footer>
          <p className="text-center text-gray-500 ">
            Copyright © 2023 Mystry Message. All rights reserved.
          </p>
        </footer>
      </section>
    </>
  );
}
