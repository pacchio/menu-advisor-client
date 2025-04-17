'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

type Question = {
  question: string
  type: 'single-selection' | 'multi-selection' | 'open-text'
  possible_answers: string[] | null
}

type Dish = {
  id: string
  name: string
  description: string
  price: number
  ingredients: { id: string; name: string }[]
  allergens: string[]
  categoryId: string
  categoryName: string
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string[] | string>>({})
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    handleGetQuestions()
  }, [])

  const handleGetQuestions = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/generate-questions`, {
        merchant_id: '5f4d157ed8eef50017ed8836',
        menu_id: 'menu',
        language: 'en',
      })
      setQuestions(res.data.questions)
      setAnswers({})
      setDishes([])
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Transform answers into the required format
      const userPreferences = {
        preferences: Object.entries(answers).map(([question, answer]) => ({
          question,
          answer: Array.isArray(answer) ? answer.join(', ') : answer,
        })),
      }

      const res = await axios.post(`${BASE_URL}/suggest-dishes`, {
        merchant_id: '5f4d157ed8eef50017ed8836',
        menu_id: 'menu',
        language: 'en',
        user_preferences: userPreferences,
      })
      setDishes(res.data.suggested_dishes)
    } catch (error) {
      console.error('Error fetching dish suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (question: string, answer: string, multi: boolean) => {
    setAnswers((prev) => {
      const current = prev[question]
      if (multi) {
        // Ensure current is an array before calling .filter
        const updated = Array.isArray(current) ? [...current] : []
        if (updated.includes(answer)) {
          return {
            ...prev,
            [question]: updated.filter((a) => a !== answer),
          }
        } else {
          return {
            ...prev,
            [question]: [...updated, answer],
          }
        }
      } else {
        return { ...prev, [question]: answer }
      }
    })
  }

  const handleTextAnswer = (question: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [question]: text }))
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center">Menu Advisor</h1>

      <button
        onClick={handleGetQuestions}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-6 block mx-auto"
      >
        Generate New Questions
      </button>

      {loading && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {questions.length > 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <div className="space-y-6">
            {questions.map((q, i) => (
              <div key={i}>
                <p className="font-semibold">{q.question}</p>
                {q.type === 'multi-selection' && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {q.possible_answers?.map((a) => {
                      const selected = (answers[q.question] as string[] || []).includes(a)
                      return (
                        <label key={a} className="inline-flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={selected}
                            onChange={() => handleAnswer(q.question, a, true)}
                          />
                          <span>{a}</span>
                        </label>
                      )
                    })}
                  </div>
                )}

                {q.type === 'single-selection' && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {q.possible_answers?.map((a) => {
                      const selected = answers[q.question] === a
                      return (
                        <label key={a} className="inline-flex items-center space-x-2">
                          <input
                            type="radio"
                            className="form-radio"
                            checked={selected}
                            onChange={() => handleAnswer(q.question, a, false)}
                          />
                          <span>{a}</span>
                        </label>
                      )
                    })}
                  </div>
                )}

                {q.type === 'open-text' && (
                  <input
                    type="text"
                    className="mt-2 p-2 w-full border rounded"
                    placeholder="Your answer..."
                    value={answers[q.question] || ''}
                    onChange={(e) => handleTextAnswer(q.question, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded block mx-auto w-full"
          >
            Submit Preferences
          </button>
        </form>
      )}

      {dishes.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Suggested Dishes</h2>
          <ul className="space-y-4">
            {dishes.map((dish) => (
              <li key={dish.id} className="border rounded p-4">
                <h3 className="text-lg font-bold">{dish.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Category: {dish.categoryName}
                </p>
                {dish.ingredients.length > 0 && (
                  <p className="text-sm">
                    Ingredients:{' '}
                    {dish.ingredients.map((i) => i.name).join(', ')}
                  </p>
                )}
                {dish.allergens.length > 0 && (
                  <p className="text-sm text-red-600">
                    Allergens: {dish.allergens.join(', ')}
                  </p>
                )}
                <p className="font-semibold mt-2">€ {dish.price}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
