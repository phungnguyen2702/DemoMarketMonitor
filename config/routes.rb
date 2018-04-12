Rails.application.routes.draw do
  get 'barchart',to: 'home#barchart'

  get 'scatter', to: "home#scatter"

  root "home#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
