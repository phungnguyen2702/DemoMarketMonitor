Rails.application.routes.draw do
  root 'home#barchart'

  get 'scatter', to: "home#scatter"

  get 'home', to: "home#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
